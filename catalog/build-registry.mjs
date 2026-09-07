import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceIndexPath = path.join(catalogDirectory, "source-index.json");
const registryPath = path.join(catalogDirectory, "registry.json");
const documentSourceManifestPath = path.join(catalogDirectory, "document-sources.json");

const validKinds = new Set([
  "http_api",
  "plugin_point",
  "jssdk_api",
  "event_contract",
  "ai_capability",
]);
const validStatuses = new Set([
  "verified",
  "source_silent",
  "needs_runtime_validation",
  "deprecated",
]);
const validUsageFrequencies = new Set(["high", "medium", "low"]);
const capabilityIdPattern = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const documentPathPattern = /^docs\/.+\.md$/;
const documentAnchorPattern = /^capability-[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const officialHost = "project.feishu.cn";
const documentSourceManifest = JSON.parse(readFileSync(documentSourceManifestPath, "utf8"));

const curatedOverrides = {
  "plugin-point.control": {
    status: "verified",
    fixtureIds: ["plugin-point.control.fixture"],
    contract: {
      point: "control",
      resource: {
        binding: "resourceId",
        platforms: ["web", "mobile"],
        positions: ["detail-form", "node-form", "table-column"],
      },
      runtime: {
        contextApi: "window.JSSDK.control.getContext",
        formLoading: "viewport-driven",
        newFormContextKey: "UUID",
      },
    },
  },
  "plugin-point.tab": {
    status: "verified",
    fixtureIds: ["plugin-point.tab.fixture"],
    contract: {
      point: "tab",
      resource: {
        binding: "resourceId",
        platforms: ["web", "mobile"],
        location: "work-item-detail-tab",
      },
      runtime: {
        contextApi: "window.JSSDK.tab.getContext",
        instanceScope: "workItemId",
        formValueListener: "web-only",
      },
    },
  },
  "plugin-point.configuration": {
    status: "verified",
    fixtureIds: ["plugin-point.configuration.fixture"],
    contract: {
      point: "configuration",
      resource: {
        binding: "resourceId",
        platforms: ["web"],
        location: "space-plugin-configuration",
      },
      runtime: {
        contextApi: "window.JSSDK.configuration.getContext",
        scope: "spaceId",
      },
    },
  },
  "jssdk.control.get-context": {
    status: "verified",
    fixtureIds: ["jssdk.control.get-context.fixture"],
    contract: {
      namespace: "control",
      methods: ["getContext"],
      supportedPoints: ["plugin-point.control"],
      returnedContext: ["spaceId", "workObjectId", "workItemId", "UUID", "nodeId"],
    },
  },
  "openapi.work-item.get": {
    status: "verified",
    fixtureIds: ["openapi.work-item.get.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/:project_key/work_item/:work_item_type_key/query",
      },
      auth: [
        { header: "X-Plugin-Token", requirement: "required" },
        {
          header: "X-User-Key",
          requirement: "required when the selected authorization mode requires it",
        },
      ],
      permissions: [
        {
          category: "work-item",
          requirement: "grant the required interface scope before calling",
        },
      ],
      preconditions: [
        "project_key identifies the target space",
        "work_item_type_key matches the requested item type",
        "work_item_ids contains no more than 50 identifiers",
      ],
    },
  },
  "openapi.work-item.create": {
    status: "verified",
    fixtureIds: ["openapi.work-item.create.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/:project_key/work_item/create",
      },
      auth: [
        { header: "X-Plugin-Token", requirement: "required" },
        {
          header: "X-User-Key",
          requirement: "required when the selected authorization mode requires it",
        },
      ],
      permissions: [
        {
          category: "work-item",
          requirement: "grant the required interface scope before calling",
        },
      ],
      preconditions: [
        "project_key identifies the target space",
        "work_item_type_key selects the item type to create",
        "the payload satisfies the selected item type's required fields",
      ],
    },
  },
  "openapi.work-item.update": {
    status: "verified",
    fixtureIds: ["openapi.work-item.update.fixture"],
    contract: {
      operation: {
        method: "PUT",
        path: "/open_api/:project_key/work_item/:work_item_type_key/:work_item_id",
      },
      auth: [
        { header: "X-Plugin-Token", requirement: "required" },
        {
          header: "X-User-Key",
          requirement: "required when the selected authorization mode requires it",
        },
      ],
      permissions: [
        {
          category: "work-item",
          requirement: "grant the required interface scope before calling",
        },
      ],
      preconditions: [
        "project_key identifies the target space",
        "work_item_type_key matches the target item type",
        "work_item_id identifies an item of that type",
        "update_fields uses a valid field key or field alias",
      ],
    },
  },
  "plugin-point.button": {
    status: "verified",
    fixtureIds: ["plugin-point.button.fixture"],
    contract: {
      point: "button",
      resource: {
        binding: "resourceId",
        platforms: ["web", "mobile"],
      },
      runtime: {
        contextApi: "window.JSSDK.button.getContext",
      },
    },
  },
  "jssdk.button.get-context": {
    status: "verified",
    fixtureIds: ["jssdk.button.get-context.fixture"],
    contract: {
      namespace: "button",
      methods: ["getContext"],
      supportedPoints: ["plugin-point.button"],
    },
  },
  "jssdk.tab.get-context": {
    status: "verified",
    fixtureIds: ["jssdk.tab.get-context.fixture"],
    contract: {
      namespace: "tab",
      methods: ["getContext"],
      supportedPoints: ["plugin-point.tab"],
    },
  },
  "jssdk.configuration.get-context": {
    status: "verified",
    fixtureIds: ["jssdk.configuration.get-context.fixture"],
    contract: {
      namespace: "configuration",
      methods: ["getContext"],
      supportedPoints: ["plugin-point.configuration"],
    },
  },
  "jssdk.context.load": {
    status: "verified",
    fixtureIds: ["jssdk.context.load.fixture"],
    contract: {
      namespace: "Context",
      methods: ["load"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.shared.set-shared-modules": {
    status: "verified",
    fixtureIds: ["jssdk.shared.set-shared-modules.fixture"],
    contract: {
      namespace: "shared",
      methods: ["setSharedModules"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.storage.get-item": {
    status: "verified",
    fixtureIds: ["jssdk.storage.get-item.fixture"],
    contract: {
      namespace: "storage",
      methods: ["getItem"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.storage.set-item": {
    status: "verified",
    fixtureIds: ["jssdk.storage.set-item.fixture"],
    contract: {
      namespace: "storage",
      methods: ["setItem"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.storage.remove-item": {
    status: "verified",
    fixtureIds: ["jssdk.storage.remove-item.fixture"],
    contract: {
      namespace: "storage",
      methods: ["removeItem"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.container-modal.close": {
    status: "verified",
    fixtureIds: ["jssdk.container-modal.close.fixture"],
    contract: {
      namespace: "containerModal",
      methods: ["close"],
      supportedPoints: ["plugin-point.button"],
    },
  },
  "jssdk.toast.error": {
    status: "verified",
    fixtureIds: ["jssdk.toast.error.fixture"],
    contract: {
      namespace: "toast",
      methods: ["error"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.toast.success": {
    status: "verified",
    fixtureIds: ["jssdk.toast.success.fixture"],
    contract: {
      namespace: "toast",
      methods: ["success"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.toast.warning": {
    status: "verified",
    fixtureIds: ["jssdk.toast.warning.fixture"],
    contract: {
      namespace: "toast",
      methods: ["warning"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "jssdk.toast.info": {
    status: "verified",
    fixtureIds: ["jssdk.toast.info.fixture"],
    contract: {
      namespace: "toast",
      methods: ["info"],
      supportedPoints: ["supported client plugin points"],
    },
  },
  "openapi.post.open-api-authen-plugin-token": {
    status: "verified",
    fixtureIds: ["openapi.authen.plugin-token.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/authen/plugin_token",
      },
      auth: [
        { input: "plugin_id", requirement: "required" },
        { input: "plugin_secret", requirement: "required" },
      ],
      permissions: [
        { category: "plugin credential", requirement: "plugin secret is required" },
      ],
      preconditions: ["request this token before sending token-authenticated OpenAPI calls"],
    },
  },
  "openapi.post.open-api-authen-user-plugin-token": {
    status: "verified",
    fixtureIds: ["openapi.authen.user-plugin-token.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/authen/user_plugin_token",
      },
      auth: [
        { input: "plugin_access_token", requirement: "required" },
        { input: "authorization code", requirement: "required" },
      ],
      permissions: [
        { category: "user authorization", requirement: "exchange a valid single-use code" },
      ],
      preconditions: ["authorization code has not expired or been used"],
    },
  },
  "openapi.post.open-api-authen-refresh-token": {
    status: "verified",
    fixtureIds: ["openapi.authen.refresh-token.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/authen/refresh_token",
      },
      auth: [
        { input: "plugin_access_token", requirement: "required" },
        { input: "refresh_token", requirement: "required" },
      ],
      permissions: [
        { category: "user authorization", requirement: "use an unexpired refresh token" },
      ],
      preconditions: ["store and rotate the refresh token only on the server"],
    },
  },
  "openapi.post.open-api-project-key-field-all": {
    status: "verified",
    fixtureIds: ["openapi.project-key.field-all.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/:project_key/field/all",
      },
      auth: [{ header: "X-Plugin-Token", requirement: "required" }],
      permissions: [{ category: "field", requirement: "grant the required interface scope" }],
      preconditions: ["project_key identifies the target space"],
    },
  },
  "openapi.post.open-api-user-query": {
    status: "verified",
    fixtureIds: ["openapi.user.query.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/user/query",
      },
      auth: [{ header: "X-Plugin-Token", requirement: "required" }],
      permissions: [{ category: "user", requirement: "grant the required interface scope" }],
      preconditions: ["query identifiers belong to the authorized tenant"],
    },
  },
  "openapi.get.open-api-project-key-work-item-type-work-item-type-key": {
    status: "verified",
    fixtureIds: ["openapi.project-key.work-item-type-config.fixture"],
    contract: {
      operation: {
        method: "GET",
        path: "/open_api/:project_key/work_item/type/:work_item_type_key",
      },
      auth: [{ header: "X-Plugin-Token", requirement: "required" }],
      permissions: [{ category: "work-item", requirement: "grant the required interface scope" }],
      preconditions: ["project_key and work_item_type_key identify an accessible item type"],
    },
  },
  "openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-download": {
    status: "verified",
    fixtureIds: ["openapi.project-key.work-item-file-download.fixture"],
    contract: {
      operation: {
        method: "POST",
        path: "/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/file/download",
      },
      auth: [{ header: "X-Plugin-Token", requirement: "required" }],
      permissions: [{ category: "file", requirement: "grant the required interface scope" }],
      preconditions: ["uuid identifies an attachment visible to the caller"],
    },
  },
  "event-contract.webhook-signature": {
    status: "needs_runtime_validation",
    fixtureIds: ["event-contract.webhook-signature.fixture"],
    contract: {
      delivery: {
        scope: "callback-token configured event callbacks",
      },
      verification: {
        algorithm: "SHA-256",
        encoding: "UTF-8",
        input: ["plugin_id", "request_time", "callback_token"],
        concatenation: "direct",
        output: "lowercase-hex",
      },
      acknowledgement: {
        responseContract: "source_silent",
      },
    },
  },
  "event-contract.listen": {
    status: "needs_runtime_validation",
    fixtureIds: ["event-contract.listen.fixture"],
    contract: {
      delivery: {
        transport: "HTTP POST",
        requestTimeUnit: "milliseconds",
        deduplicationKey: "data.idempotent_key",
      },
      verification: {
        callbackToken: "optional",
        documentedAlgorithm: "see event-contract.webhook-signature",
      },
      acknowledgement: {
        status: 200,
        withinMilliseconds: 1000,
        responseBody: "source_silent",
        retryIntervals: ["immediately", "1 minute", "2 minutes", "7 minutes"],
      },
    },
  },
  "event-contract.intercept": {
    status: "needs_runtime_validation",
    fixtureIds: ["event-contract.intercept.fixture"],
    contract: {
      delivery: {
        transport: "HTTP POST",
        requestTimeUnit: "seconds",
        decisionBoundary: "before the action",
      },
      verification: {
        callbackToken: "optional",
        documentedAlgorithm: "see event-contract.webhook-signature",
      },
      acknowledgement: {
        withinMilliseconds: 1000,
        defaultOnTimeout: "allow",
        responseField: "need_intercept",
      },
    },
  },
  "event-contract.control-create-callback": {
    status: "needs_runtime_validation",
    fixtureIds: ["event-contract.control-create-callback.fixture"],
    contract: {
      delivery: {
        transport: "HTTP POST",
      },
      verification: {
        documentedAlgorithm: "see event-contract.webhook-signature",
      },
      acknowledgement: {
        status: 200,
        responseBody: "empty",
        sourceExample: {
          afterFieldValue: "JSON string",
          controlUuidJsonPath: "__system_control_uuid after JSON.parse(data.field_info[].after_field_value)",
        },
      },
    },
  },
};

const relatedCapabilities = {
  "plugin-point.control": [
    "jssdk.control.get-context",
    "event-contract.control-create-callback",
  ],
  "jssdk.control.get-context": [
    "plugin-point.control",
    "event-contract.control-create-callback",
  ],
  "event-contract.webhook-signature": [
    "event-contract.listen",
    "event-contract.intercept",
    "event-contract.control-create-callback",
  ],
  "event-contract.listen": ["event-contract.webhook-signature"],
  "event-contract.intercept": ["event-contract.webhook-signature"],
  "event-contract.control-create-callback": [
    "plugin-point.control",
    "jssdk.control.get-context",
    "event-contract.webhook-signature",
  ],
  "plugin-point.button": [
    "jssdk.button.get-context",
    "jssdk.container-modal.close",
  ],
  "jssdk.button.get-context": ["plugin-point.button"],
  "jssdk.container-modal.close": ["plugin-point.button"],
  "jssdk.context.load": [
    "jssdk.shared.set-shared-modules",
    "jssdk.storage.get-item",
  ],
  "jssdk.shared.set-shared-modules": ["jssdk.context.load"],
  "jssdk.storage.get-item": [
    "jssdk.storage.set-item",
    "jssdk.storage.remove-item",
  ],
  "jssdk.storage.set-item": ["jssdk.storage.get-item"],
  "jssdk.storage.remove-item": ["jssdk.storage.get-item"],
  "jssdk.toast.error": ["jssdk.toast.success", "jssdk.toast.warning", "jssdk.toast.info"],
  "jssdk.toast.success": ["jssdk.toast.error", "jssdk.toast.warning", "jssdk.toast.info"],
  "jssdk.toast.warning": ["jssdk.toast.error", "jssdk.toast.success", "jssdk.toast.info"],
  "jssdk.toast.info": ["jssdk.toast.error", "jssdk.toast.success", "jssdk.toast.warning"],
  "openapi.post.open-api-authen-plugin-token": [
    "openapi.post.open-api-authen-user-plugin-token",
    "openapi.post.open-api-authen-refresh-token",
  ],
  "openapi.post.open-api-authen-user-plugin-token": [
    "openapi.post.open-api-authen-plugin-token",
    "openapi.post.open-api-authen-refresh-token",
  ],
  "openapi.post.open-api-authen-refresh-token": [
    "openapi.post.open-api-authen-plugin-token",
    "openapi.post.open-api-authen-user-plugin-token",
  ],
  "openapi.post.open-api-project-key-field-all": [
    "openapi.get.open-api-project-key-work-item-type-work-item-type-key",
    "openapi.work-item.create",
    "openapi.work-item.update",
  ],
  "openapi.post.open-api-user-query": ["openapi.work-item.get"],
  "openapi.get.open-api-project-key-work-item-type-work-item-type-key": [
    "openapi.post.open-api-project-key-field-all",
    "openapi.work-item.create",
  ],
  "openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-download": [
    "openapi.work-item.get",
  ],
  "plugin-point.tab": [
    "jssdk.tab.get-context",
    "jssdk.tab.on-work-item-form-value-changed",
  ],
  "jssdk.tab.get-context": ["plugin-point.tab"],
  "jssdk.tab.on-work-item-form-value-changed": ["plugin-point.tab"],
  "plugin-point.configuration": [
    "jssdk.configuration.get-context",
    "jssdk.shared.set-shared-modules",
  ],
  "jssdk.configuration.get-context": ["plugin-point.configuration"],
  "jssdk.shared.set-shared-modules": ["plugin-point.configuration"],
  "openapi.work-item.get": [
    "openapi.work-item.create",
    "openapi.work-item.update",
  ],
  "openapi.work-item.create": [
    "openapi.work-item.get",
    "openapi.work-item.update",
  ],
  "openapi.work-item.update": [
    "openapi.work-item.get",
    "openapi.work-item.create",
  ],
};

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function documentSourcesByOfficialUrl(manifest) {
  ensure(manifest?.schemaVersion === 1, "catalog/document-sources.json: schemaVersion must be 1.");
  ensure(Array.isArray(manifest.sources), "catalog/document-sources.json must contain sources.");

  const sourcesByOfficialUrl = new Map();
  for (const source of manifest.sources) {
    ensure(source && typeof source === "object", "Document source must be an object.");
    ensure(
      source.platform === "openapi" || source.platform === "plugin",
      `Invalid document platform for ${source.sourcePath ?? "unknown"}.`,
    );
    ensure(
      typeof source.sourcePath === "string" && source.sourcePath.endsWith(".md"),
      "Document source must have a Markdown source path.",
    );
    ensure(
      typeof source.targetPath === "string" && documentPathPattern.test(source.targetPath),
      `Invalid document target path for ${source.sourcePath}.`,
    );
    ensure(
      typeof source.officialUrl === "string" || source.officialUrl === null,
      `Invalid official URL for document source ${source.sourcePath}.`,
    );
    if (source.officialUrl === null) {
      continue;
    }

    const url = new URL(source.officialUrl);
    ensure(
      url.protocol === "https:" && url.hostname === officialHost,
      `Invalid official URL for document source ${source.sourcePath}.`,
    );
    ensure(
      !sourcesByOfficialUrl.has(source.officialUrl),
      `Duplicate document official URL: ${source.officialUrl}.`,
    );
    sourcesByOfficialUrl.set(source.officialUrl, source);
  }

  return sourcesByOfficialUrl;
}

function validateSourceCapability(capability) {
  const allowedKeys = new Set([
    "id",
    "kind",
    "title",
    "officialUrl",
    "status",
    "usageFrequency",
    "frequencyBasis",
    "tags",
    "sourceSilenceEvidence",
  ]);

  ensure(capability && typeof capability === "object", "Source capability must be an object.");
  ensure(
    Object.keys(capability).every((key) => allowedKeys.has(key)),
    `Source capability ${capability.id ?? "unknown"} contains unsupported metadata.`,
  );
  ensure(capabilityIdPattern.test(capability.id), `Invalid capability ID: ${capability.id}`);
  ensure(validKinds.has(capability.kind), `Invalid kind for ${capability.id}.`);
  ensure(typeof capability.title === "string" && capability.title.length > 0, `Missing title for ${capability.id}.`);
  ensure(typeof capability.officialUrl === "string", `Missing official URL for ${capability.id}.`);
  ensure(validStatuses.has(capability.status), `Invalid status for ${capability.id}.`);
  ensure(validUsageFrequencies.has(capability.usageFrequency), `Invalid usage frequency for ${capability.id}.`);
  ensure(
    capability.frequencyBasis === "local-static-heuristic",
    `Invalid frequency basis for ${capability.id}.`,
  );
  ensure(
    Array.isArray(capability.tags) && capability.tags.length > 0,
    `Missing tags for ${capability.id}.`,
  );
  const officialUrl = new URL(capability.officialUrl);
  ensure(
    officialUrl.protocol === "https:" && officialUrl.hostname === officialHost,
    `Invalid official URL for ${capability.id}.`,
  );

  if (capability.status === "source_silent") {
    ensure(
      typeof capability.sourceSilenceEvidence === "string" && capability.sourceSilenceEvidence.length > 0,
      `${capability.id} must document the source gap before using source_silent.`,
    );
  } else {
    ensure(
      !("sourceSilenceEvidence" in capability),
      `${capability.id} may only include source silence evidence with source_silent.`,
    );
  }
}

function validateGeneratedCapability(capability, knownIds) {
  const allowedKeys = new Set([
    "id",
    "kind",
    "title",
    "officialUrl",
    "docPath",
    "docAnchor",
    "status",
    "usageFrequency",
    "frequencyBasis",
    "tags",
    "related",
    "fixtureIds",
    "contract",
    "sourceSilenceEvidence",
  ]);

  ensure(
    Object.keys(capability).every((key) => allowedKeys.has(key)),
    `Generated capability ${capability.id} contains an unsupported field.`,
  );
  ensure(documentPathPattern.test(capability.docPath), `Invalid document path for ${capability.id}.`);
  ensure(documentAnchorPattern.test(capability.docAnchor), `Invalid document anchor for ${capability.id}.`);
  const hasFixture = "fixtureIds" in capability;
  const hasContract = "contract" in capability;
  const hasCuratedMaterial = hasFixture || hasContract;

  ensure(
    hasFixture === hasContract,
    `${capability.id} must publish fixture IDs and a contract together.`,
  );

  for (const relatedId of capability.related ?? []) {
    ensure(relatedId !== capability.id, `${capability.id} cannot relate to itself.`);
    ensure(knownIds.has(relatedId), `${capability.id} references an unknown related capability.`);
  }

  if (capability.status === "source_silent") {
    ensure(
      typeof capability.sourceSilenceEvidence === "string" && capability.sourceSilenceEvidence.length > 0,
      `${capability.id} needs source silence evidence.`,
    );
    ensure(!hasCuratedMaterial, `${capability.id} must not publish a source-silent contract.`);
  } else {
    ensure(
      !("sourceSilenceEvidence" in capability),
      `${capability.id} may only publish source silence evidence with source_silent.`,
    );
  }

  if (capability.status === "verified") {
    ensure(hasCuratedMaterial, `${capability.id} needs curated material before verification.`);
  }

  if (capability.usageFrequency === "high") {
    ensure(capability.status === "verified", `${capability.id} must be verified at high usage frequency.`);
    ensure(hasCuratedMaterial, `${capability.id} needs curated material at high usage frequency.`);
  }

  if (!hasCuratedMaterial) {
    return;
  }

  ensure(Array.isArray(capability.fixtureIds) && capability.fixtureIds.length > 0, `${capability.id} needs a fixture.`);
  ensure(capability.contract && typeof capability.contract === "object", `${capability.id} needs a contract.`);

  const requiredContractFields = {
    http_api: ["operation", "auth", "permissions", "preconditions"],
    plugin_point: ["point", "resource", "runtime"],
    jssdk_api: ["namespace", "methods", "supportedPoints"],
    event_contract: ["delivery", "verification", "acknowledgement"],
    ai_capability: ["capability", "lifecycle", "permissions"],
  };

  for (const field of requiredContractFields[capability.kind]) {
    ensure(field in capability.contract, `${capability.id} contract is missing ${field}.`);
  }
}

export function buildRegistry(sourceIndex) {
  ensure(sourceIndex?.schemaVersion === 1, "catalog/source-index.json: schemaVersion must be 1.");
  ensure(
    typeof sourceIndex.generatedAt === "string" && isoDatePattern.test(sourceIndex.generatedAt),
    "catalog/source-index.json: generatedAt must be an ISO date.",
  );
  ensure(Array.isArray(sourceIndex.capabilities), "catalog/source-index.json must contain capabilities.");

  const sourceIds = new Set();
  const sourcesByOfficialUrl = documentSourcesByOfficialUrl(documentSourceManifest);
  for (const capability of sourceIndex.capabilities) {
    validateSourceCapability(capability);
    ensure(!sourceIds.has(capability.id), `Duplicate source capability ID: ${capability.id}.`);
    sourceIds.add(capability.id);
  }

  for (const id of Object.keys(curatedOverrides)) {
    ensure(sourceIds.has(id), `Missing curated source capability: ${id}.`);
  }

  const capabilities = sourceIndex.capabilities.map((sourceCapability) => {
    const override = curatedOverrides[sourceCapability.id];
    const documentSource = sourcesByOfficialUrl.get(sourceCapability.officialUrl);
    ensure(
      documentSource,
      `${sourceCapability.id} has no matching source page in catalog/document-sources.json.`,
    );
    const record = {
      id: sourceCapability.id,
      kind: sourceCapability.kind,
      title: sourceCapability.title,
      officialUrl: sourceCapability.officialUrl,
      docPath: documentSource.targetPath,
      docAnchor: `capability-${sourceCapability.id}`,
      status: override?.status ?? sourceCapability.status,
      usageFrequency: sourceCapability.usageFrequency,
      frequencyBasis: sourceCapability.frequencyBasis,
      tags: sourceCapability.tags,
    };

    const related = relatedCapabilities[sourceCapability.id];
    if (related) {
      record.related = related;
    }
    if (sourceCapability.sourceSilenceEvidence) {
      record.sourceSilenceEvidence = sourceCapability.sourceSilenceEvidence;
    }
    if (override) {
      record.fixtureIds = override.fixtureIds;
      record.contract = override.contract;
    }
    return record;
  });

  const capabilityIds = new Set(capabilities.map(({ id }) => id));
  const verifiedCapabilities = capabilities.filter(({ status }) => status === "verified");
  const verifiedOverrideCount = Object.values(curatedOverrides).filter(
    ({ status }) => status === "verified",
  ).length;
  ensure(
    verifiedCapabilities.length === verifiedOverrideCount,
    "Only explicitly overridden capabilities may be verified.",
  );

  for (const capability of capabilities) {
    validateGeneratedCapability(capability, capabilityIds);
  }

  return {
    schemaVersion: 1,
    generatedAt: sourceIndex.generatedAt,
    capabilities: capabilities.sort((left, right) => left.id.localeCompare(right.id)),
  };
}

async function main() {
  const sourceIndex = JSON.parse(await readFile(sourceIndexPath, "utf8"));
  const registry = buildRegistry(sourceIndex);
  await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(`Wrote ${registry.capabilities.length} capabilities to catalog/registry.json.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
