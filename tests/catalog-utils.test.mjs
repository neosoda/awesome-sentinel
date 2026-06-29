import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canonicalizeUrl,
  findDuplicateGroups,
  normalizeTags,
  looksGenericDescription,
  classifyTool,
  validateCatalog,
} from '../scripts/catalog-utils.mjs'

test('canonicalizeUrl strips tracking and normalizes GitHub repository views', () => {
  assert.equal(
    canonicalizeUrl('https://github.com/OWNER/repo/blob/main/README.md?utm_source=x#readme'),
    'https://github.com/OWNER/repo',
  )
  assert.equal(canonicalizeUrl('https://example.com/path/?utm_campaign=x&ok=1#top'), 'https://example.com/path?ok=1')
})

test('findDuplicateGroups groups tools by canonical URL', () => {
  const groups = findDuplicateGroups([
    { slug: 'a', githubUrl: 'https://github.com/acme/tool' },
    { slug: 'b', githubUrl: 'https://github.com/acme/tool/issues' },
    { slug: 'c', websiteUrl: 'https://example.com' },
  ])
  assert.equal(groups.length, 1)
  assert.deepEqual(groups[0].tools.map((tool) => tool.slug), ['a', 'b'])
})

test('normalizeTags merges aliases and removes useless imported tags', () => {
  assert.deepEqual(
    normalizeTags(['open source', 'opensource', 'self hosted', 'command line', 'github', 'outil']),
    ['open-source', 'self-hosted', 'cli'],
  )
})

test('looksGenericDescription detects scraped placeholders and raw GitHub snippets', () => {
  assert.equal(looksGenericDescription('Contribute to owner/repository development by creating an account on GitHub.'), true)
  assert.equal(looksGenericDescription('Plateforme de supervision avec alertes et tableaux de bord.'), false)
})

test('classifyTool uses functional taxonomy instead of temporary categories', () => {
  assert.equal(
    classifyTool({
      title: 'Uptime Kuma',
      shortDescription: 'Self-hosted monitoring tool with status pages and alerts',
      categorySlug: 'a-verifier',
      tags: ['docker', 'monitoring'],
    }),
    'monitoring-observabilite',
  )
})

test('validateCatalog reports weak descriptions and invalid categories', () => {
  const issues = validateCatalog([
    {
      slug: 'bad',
      categorySlug: 'a-verifier',
      shortDescription: 'GitHub - owner/repository',
      tags: ['one', 'one'],
      websiteUrl: 'not-a-url',
      isOpenSource: true,
      license: null,
      verification: {},
    },
  ])
  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    ['duplicate-tags', 'invalid-category', 'invalid-url', 'open-source-without-license', 'weak-description'].sort(),
  )
})
