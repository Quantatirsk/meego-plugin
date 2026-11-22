"""Compare the public Feishu Project developer manual with a local meego-plugin checkout."""
import argparse
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import urlsplit

BASE = 'https://project.feishu.cn/b/helpcenter/1p8d7djs/'
BASELINE = '2026-09-08'
SECTIONS = {'开发插件', '开发 AI 应用', '集成客户端 API 和组件', '接入 Open API', '使用开发工具 CLI'}
METHOD = r'GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS'
PATH = r'/open_api/[A-Za-z0-9_:/{}.-]+'
OFFICIAL_ROW = re.compile(rf'^\s*\*?\s*({METHOD})\s*[-－–—]?\s*\*?\s*({PATH})', re.M)
OFFICIAL_DECLARATION = re.compile(rf'请求方式[：:]\s*({METHOD})\s*\*?\s*请求地址[：:]\s*\*?\s*({PATH})')
LOCAL_ROW = re.compile(rf'\|\s*`({METHOD})`\s*\|\s*`({PATH})[^`]*`\s*\|\s*\[[^\n]*?\]\(([^)]+\.md)\)')
SHANGHAI = timezone(timedelta(hours=8))


def json_write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def fetch(page):
    assert re.fullmatch(r'\w+', page, re.ASCII)
    html = subprocess.check_output([
        'curl', '-fLsS', '--max-time', '22', '--retry', '1', '--compressed', BASE + page,
    ]).decode()
    # The public page includes server-rendered document data. Fail if Feishu changes the page format.
    marker = re.search(r'window\._ROUTER_DATA\s*=\s*', html)
    if not marker:
        raise ValueError('Public page did not contain its document payload')
    data = json.JSONDecoder().raw_decode(html[marker.end():])[0]['loaderData']['layout']
    doc = data['docDetail']
    if doc['path'] != page or doc['scope'] != 'public' or not doc['content']['children']:
        raise ValueError('Public document identity or content could not be confirmed')
    return data


def public_pages(nodes, parents=()):
    for node in nodes:
        if node.get('deleted'):
            continue
        if node['is_dir']:
            yield from public_pages(node.get('subs', []), (*parents, node['title']))
        elif node.get('status') == 1 and node.get('scope') == 'public' and node.get('visibility') in (None, 1):
            yield parents, node


def text_runs(value):
    if isinstance(value, dict):
        if value.get('componentType') == 'local.component.Text':
            yield from text_runs(value['props']['value'])
        elif isinstance(value.get('insert'), str):
            yield value['insert']
        else:
            for item in value.values():
                yield from text_runs(item)
    elif isinstance(value, list):
        for item in value:
            yield from text_runs(item)


def published(node):
    stamp = node.get('publish_at')
    return datetime.fromisoformat(stamp).astimezone(SHANGHAI).date().isoformat() if stamp else ''


def make_table(title, rows, labels):
    return {'title': title, 'columns': [{'key': key, 'label': label, 'type': 'text'} for key, label in labels.items()], 'rows': rows}


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('repo', type=Path)
    args.add_argument('output', type=Path)
    args.add_argument('--since', default=BASELINE, type=lambda value: datetime.strptime(value, '%Y-%m-%d').date().isoformat(), help='Flag pages published after this Beijing date')
    args.add_argument('--reuse-snapshots', action='store_true', help='Reuse article bodies already downloaded in this output folder')
    args = args.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    snapshots = args.output / 'official-pages'
    snapshots.mkdir(exist_ok=True)
    skill = args.repo / 'skills/meego-plugin'
    source = json.loads((args.repo / 'maintainer/provenance/document-sources.json').read_bytes())['sources']
    catalog = json.loads((skill / 'catalog/capabilities.json').read_bytes())['capabilities']
    local_docs = defaultdict(list)
    for row in source:
        if (skill / row['targetPath']).is_file():
            local_docs[urlsplit(row['officialUrl']).path.rstrip('/').split('/')[-1]].append(row['targetPath'])
    capability_docs = {row['docPath'] for row in catalog if row['kind'] == 'http_api'}
    endpoint_file = skill / 'docs/openapi/ENDPOINTS.md'
    local_http = {(method, path): f'docs/openapi/{doc}' for method, path, doc in LOCAL_ROW.findall(endpoint_file.read_text())}
    assert len(local_http) >= 120 and sum(doc in capability_docs for doc in local_http.values()) >= 120

    index = fetch('wlcwhshe')
    directory = list(public_pages(index['busStructure']))
    rows = []
    for parents, node in directory:
        key = node['path']
        date = published(node)
        local = local_docs.get(key, [])
        group = parents[0] if parents else ''
        rows.append({
            'section': group, 'category': ' / '.join(parents[1:]), 'title': node['title'], 'id': key,
            'url': BASE + key, 'published': date, 'scope': '核心范围' if group in SECTIONS else '补充范围',
            'local': ' | '.join(sorted(local)),
            'status': ('已收录 · 待复核' if date > args.since else '已收录') if local else '按官方页面 ID 未匹配',
        })
    assert len(rows) >= 240 and len({r['id'] for r in rows}) == len(rows)
    targets = [row for row in rows if row['id'] == 'wlcwhshe' or (row['scope'] == '核心范围' and (row['published'] > args.since or not row['local']))]
    print(f'Official public pages: {len(rows)}. Fetching {len(targets)} recent or unmatched core articles.', flush=True)

    def snapshot(row):
        page = row['id']
        try:
            saved = snapshots / f'{page}.json'
            if args.reuse_snapshots and page != 'wlcwhshe' and saved.is_file():
                cache = json.loads(saved.read_bytes())
                if published({'publish_at': cache['published_at']}) == row['published']:
                    return page, ''.join(text_runs(cache['content'])), ''
            doc = index['docDetail'] if page == 'wlcwhshe' else fetch(page)['docDetail']
            body = doc['content']
            data = {'url': row['url'], 'title': doc['title'], 'published_at': doc.get('publish_at'),
                    'version_id': doc.get('version_id'), 'sha256': hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest(),
                    'content': body}
            json_write(snapshots / f'{page}.json', data)
            return page, ''.join(text_runs(body)), ''
        except (subprocess.SubprocessError, UnicodeError, ValueError, KeyError, TypeError) as error:
            return page, '', str(error)

    with ThreadPoolExecutor(max_workers=4) as pool:
        results = {page: (text, error) for page, text, error in pool.map(snapshot, targets)}
    errors = {page: error for page, (_, error) in results.items() if error}
    api_text = results['wlcwhshe'][0]
    official_http = set(OFFICIAL_ROW.findall(api_text))
    assert len(official_http) >= 80, 'Official API list parser produced too few routes'
    http_rows = []
    # Both dedicated endpoint pages spell these paths /query. Preserve the list's original spelling in the report.
    list_typos = {
        ('POST', '/open_api/work_item/wbs_draft_create/progress/quer'),
        ('POST', '/open_api/work_item/wbs_draft_reset/progress/quer'),
    }
    for method, path in sorted(official_http):
        route = (method, path)
        typo = route in list_typos and route not in local_http
        local_doc = local_http.get((method, path + 'y') if typo else route, '')
        status = '未精确匹配'
        if local_doc in capability_docs:
            status = '已覆盖 · 以独立接口页为准' if typo else '目录和文档已覆盖'
        http_rows.append({'method': method, 'path': path, 'local': local_doc, 'status': status})
    for row in rows:
        if row['id'] in results:
            text, error = results[row['id']]
            row['snapshot'] = '拉取失败' if error else f'official-pages/{row["id"]}.json'
            if row['id'] != 'wlcwhshe' and row['section'] == '接入 Open API':
                matches = OFFICIAL_DECLARATION.findall(text)
                row['http'] = ' | '.join(f'{m} {p}' for m, p in sorted(set(matches)))
        else:
            row['snapshot'] = ''
    json_write(args.output / 'official-article-coverage.json', make_table('飞书项目官方文档覆盖检查', rows, {
        'section': '官方章节', 'title': '官方页面', 'published': '官方最近发布（北京时间）', 'scope': '比对范围',
        'status': '来源匹配', 'local': '本地文档路径', 'url': '官方 URL', 'snapshot': '官方正文快照',
    }))
    json_write(args.output / 'official-http-coverage.json', make_table('官方 API 总表覆盖检查', http_rows, {
        'method': '方法', 'path': '官方路径（去查询参数）', 'status': '匹配状态', 'local': '本地文档路径',
    }))
    core = [row for row in rows if row['scope'] == '核心范围']
    print('Core articles:', len(core), Counter((r['section'], bool(r['local'])) for r in core))
    print('Core matched and republished after baseline:', [r['title'] for r in core if r['local'] and r['published'] > args.since])
    print('Core unmatched:', [(r['title'], r['id'], r.get('http', '')) for r in core if not r['local']])
    print('HTTP matches:', Counter(r['status'] for r in http_rows), 'official rows:', len(http_rows))
    print('HTTP unmatched:', [(r['method'], r['path']) for r in http_rows if r['status'] == '未精确匹配'])
    print('Snapshot errors:', errors, 'Successes:', len(results) - len(errors))
    print(args.output.resolve())
    if errors:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
