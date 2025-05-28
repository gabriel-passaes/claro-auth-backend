import * as jestGlobals from '@jest/globals'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

Object.assign(globalThis, jestGlobals)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

process.env.PUBLIC_KEY = readFileSync(join(__dirname, 'keys', 'public.pem'), 'utf8')
process.env.PRIVATE_KEY = readFileSync(join(__dirname, 'keys', 'private.pem'), 'utf8')
