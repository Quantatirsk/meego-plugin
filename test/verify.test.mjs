import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import Ajv from "ajv";

import {
  capabilitySchemaPath,
  documentationDirectory,
  fixtureDirectory,
  fixtureSchemaPath,
  skillRoot,
} from "../maintainer/paths.mjs";
import {
  checkMarkdownLinks,
  listFiles,
  pathIsDirectory,
  validateFixtureSemantics,
  verifyRepository,
} from "../maintainer/verify-corpus.mjs";

test("documentation directory is discoverable", async () => {
  assert.equal(await pathIsDirectory(documentationDirectory), true);
});

test("listFiles returns only matching documents", async () => {
  const files = await listFiles(documentationDirectory, (filePath) => filePath.endsWith(".md"));

  assert.ok(files.every((filePath) => filePath.endsWith(".md")));
});

test("installed skill topology has one entry point and an agent manifest", async () => {
  const skillsDirectory = path.dirname(skillRoot);
  const skillEntrypoints = await listFiles(skillsDirectory, (filePath) => path.basename(filePath) === "SKILL.md");
  const relativeEntrypoints = skillEntrypoints
    .map((filePath) => path.relative(skillsDirectory, filePath).split(path.sep).join("/"))
    .sort();

  assert.deepEqual(relativeEntrypoints, ["meego-plugin/SKILL.md"]);
  await readFile(path.join(skillRoot, "agents", "openai.yaml"), "utf8");
});

test("fixture semantics reject a mismatched kind and incomplete HTTP exchange", () => {
  const errors = validateFixtureSemantics(
    {
      id: "example.fixture",
      capabilityId: "openapi.example",
      kind: "plugin_point",
      cases: [
        {
          name: "incomplete-success",
          outcome: "success",
          description: "A deliberately incomplete exchange.",
        },
      ],
    },
    {
      id: "openapi.example",
      kind: "http_api",
    },
  );

  assert.ok(errors.some((error) => error.includes("does not match capability")));
  assert.ok(errors.some((error) => error.includes("requires request and response")));
});

test("fixture schema requires transport-specific success shapes", async () => {
  const fixtureSchema = JSON.parse(await readFile(fixtureSchemaPath, "utf8"));
  const validateFixture = new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(
    fixtureSchema,
  );
  const invalidHttpFixture = {
    id: "openapi.example.fixture",
    capabilityId: "openapi.example",
    kind: "http_api",
    cases: [
      {
        name: "input-output-only",
        outcome: "success",
        description: "HTTP fixtures need a request and response.",
        input: {},
        output: {},
      },
    ],
  };

  assert.equal(validateFixture(invalidHttpFixture), false);
  assert.ok(validateFixture.errors?.some((error) => error.message?.includes("request")));

  const signatureFixture = {
    id: "event-contract.webhook-signature.fixture",
    capabilityId: "event-contract.webhook-signature",
    kind: "event_contract",
    cases: [
      {
        name: "signature-computation",
        outcome: "success",
        description: "Signature calculation is a local computation.",
        input: { callbackToken: "CALLBACK_TOKEN_PLACEHOLDER" },
        output: { signature: "SIGNATURE_PLACEHOLDER" },
      },
    ],
  };
  assert.equal(validateFixture(signatureFixture), true);
});

test("source_silent capabilities require source-silence evidence", async () => {
  const capabilitySchema = JSON.parse(await readFile(capabilitySchemaPath, "utf8"));
  const validateCapability = new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(
    capabilitySchema,
  );
  const sourceSilentCapability = {
    id: "jssdk.example.source-silent",
    kind: "jssdk_api",
    title: "Example source-silent API",
    officialUrl: "https://project.feishu.cn/b/helpcenter/example",
    docPath: "docs/README.md",
    docAnchor: "capability-jssdk.example.source-silent",
    status: "source_silent",
    usageFrequency: "low",
    frequencyBasis: "local-static-heuristic",
    tags: ["example"],
  };

  assert.equal(validateCapability(sourceSilentCapability), false);
  assert.ok(
    validateCapability.errors?.some((error) => error.message?.includes("sourceSilenceEvidence")),
  );

  sourceSilentCapability.sourceSilenceEvidence = "The official source does not define a portable result shape.";
  assert.equal(validateCapability(sourceSilentCapability), true);
});

test("curated OpenAPI fixtures retain verified error statuses and source-silent success statuses", async () => {
  const fixtureNames = [
    "work-item-create",
    "work-item-get",
    "work-item-update",
    "user-query",
  ];
  const fixtures = Object.fromEntries(
    await Promise.all(
      fixtureNames.map(async (name) => {
        const content = await readFile(path.join(fixtureDirectory, "openapi", `${name}.json`), "utf8");
        return [name, JSON.parse(content)];
      }),
    ),
  );

  const expectedErrors = [
    ["work-item-get", "work-item-not-found", 30005],
    ["work-item-update", "field-not-found", 30009],
    ["user-query", "user-not-found", 30006],
  ];
  for (const [fixtureName, caseName, errCode] of expectedErrors) {
    const fixtureCase = fixtures[fixtureName].cases.find((item) => item.name === caseName);
    assert.equal(fixtureCase.response.status, 404);
    assert.equal(fixtureCase.response.body.err_code, errCode);
  }

  for (const fixtureName of fixtureNames) {
    const successCase = fixtures[fixtureName].cases.find((item) => item.outcome === "success");
    assert.equal(successCase.response.status, undefined);
    assert.match(successCase.sourceSilence, /does not specify an HTTP response status/);
  }
});

test("signature fixtures use computation input and output instead of an HTTP response", () => {
  const errors = validateFixtureSemantics(
    {
      id: "event-contract.webhook-signature.fixture",
      capabilityId: "event-contract.webhook-signature",
      kind: "event_contract",
      cases: [
        {
          name: "signature-computation",
          outcome: "success",
          description: "Compute and compare a callback signature.",
          input: { callbackToken: "CALLBACK_TOKEN_PLACEHOLDER" },
          output: { signature: "SIGNATURE_PLACEHOLDER" },
        },
      ],
    },
    {
      id: "event-contract.webhook-signature",
      kind: "event_contract",
    },
  );

  assert.deepEqual(errors, []);
});

test("Markdown validation rejects escaping paths and missing anchors", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "meego-plugin-"));
  try {
    const docsDirectory = path.join(temporaryRoot, "docs");
    await mkdir(docsDirectory, { recursive: true });
    await writeFile(
      path.join(docsDirectory, "target.md"),
      "# Valid Heading\n\n<a id=\"legacy-anchor\"></a>\n",
      "utf8",
    );
    const fence = "\`\`\`";

    const sourcePath = path.join(docsDirectory, "source.md");
    const sourceContent = [
      "<a id=\"source-anchor\"></a>",
      "[valid](target.md#valid-heading)",
      "[legacy](target.md#legacy-anchor)",
      "[same-document](#source-anchor)",
      "\`[inline example](missing.md)\`",
      fence,
      "[fenced example](missing.md)",
      fence,
      "[missing](target.md#missing-heading)",
      "[escape](../../outside.md)",
    ].join("\n");
    await writeFile(sourcePath, sourceContent, "utf8");

    const errors = [];
    await checkMarkdownLinks(sourceContent, sourcePath, errors, temporaryRoot);

    assert.ok(!errors.some((error) => error.includes("legacy-anchor")));
    assert.ok(!errors.some((error) => error.includes("source-anchor")));
    assert.ok(!errors.some((error) => error.includes("inline example")));
    assert.ok(!errors.some((error) => error.includes("fenced example")));
    assert.ok(errors.some((error) => error.includes("broken local anchor")));
    assert.ok(errors.some((error) => error.includes("escapes the corpus")));
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});

test("the checked-in capability corpus is self-consistent", async () => {
  const result = await verifyRepository();

  assert.deepEqual(result.errors, []);
  assert.equal(result.capabilityCount, 241);
  assert.equal(result.fixtureCount, 36);
  assert.equal(result.documentCount, 258);
});
