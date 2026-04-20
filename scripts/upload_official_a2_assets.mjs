#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')
const cmsRoot = path.resolve(__dirname, '..')
const manifestPath = path.join(
  repoRoot,
  'docs/product/exams/official-a2-2025/asset-manifest.json',
)

function parseDotEnv(raw) {
  const values = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator === -1) continue
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    values[key] = value
  }
  return values
}

async function loadEnv() {
  const files = ['.env', '.env.local']
  const merged = {}
  for (const relativePath of files) {
    const absolutePath = path.join(cmsRoot, relativePath)
    try {
      const raw = await fs.readFile(absolutePath, 'utf8')
      Object.assign(merged, parseDotEnv(raw))
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? merged.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? merged.SUPABASE_SERVICE_ROLE_KEY,
  }
}

async function main() {
  const env = await loadEnv()
  if (!env.url || !env.serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in cms/.env(.local).',
    )
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  const supabase = createClient(env.url, env.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  for (const asset of manifest.assets) {
    const localPath = path.join(repoRoot, asset.local_path)
    const file = await fs.readFile(localPath)
    const { error } = await supabase.storage
      .from('cms-assets')
      .upload(asset.storage_path, file, {
        contentType: asset.content_type,
        upsert: true,
      })

    if (error) {
      throw new Error(`Upload failed for ${asset.storage_path}: ${error.message}`)
    }

    console.log(`uploaded ${asset.storage_path}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
