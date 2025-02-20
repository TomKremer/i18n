import { test, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, url, createPage } from '../utils'
import { getText } from '../helper'

await setup({
  rootDir: fileURLToPath(new URL(`../fixtures/browser_language_detection/disable`, import.meta.url)),
  browser: true,
  // overrides
  nuxtConfig: {
    i18n: {
      strategy: 'no_prefix',
      detectBrowserLanguage: false
    }
  }
})

test('disable', async () => {
  const home = url('/')
  const page = await createPage(undefined, { locale: 'en' })
  await page.goto(home)
  const ctx = await page.context()

  // click `fr` lang switch link
  await page.locator('#set-locale-link-fr').click()
  expect(await ctx.cookies()).toMatchObject([])

  // navigate to about
  await page.goto(url('/about'))

  // set default locale
  expect(await getText(page, '#lang-switcher-current-locale code')).toEqual('en')

  // click `fr` lang switch link
  await page.locator('#set-locale-link-fr').click()

  // navigate with home link
  await page.locator('#link-home').click()

  // set default locale
  expect(await getText(page, '#lang-switcher-current-locale code')).toEqual('fr')
})
