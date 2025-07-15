import { defineNuxtModule, createResolver, useLogger } from '@nuxt/kit'
import { existsSync, readFileSync } from 'node:fs'
import semver from 'semver'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-version',
  },
  setup(_options, _nuxt) {
    _nuxt.hook('nitro:config', (config) => {
      const logger = useLogger('nuxt-version')
      if (!config?.rootDir) {
        logger.warn('nuxt-version: rootDir is not set')
        return
      }

      const resolver = createResolver(config.rootDir)
      const packageJsonPath = resolver.resolve('./package.json')
      try {
        const fileExists = existsSync(packageJsonPath)
        if (!fileExists) {
          logger.warn('nuxt-version: package.json not found')
          return
        }
      }
      catch (error) {
        logger.error('nuxt-version: error reading package.json', error)
        return
      }

      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        if (!packageJson.version) {
          logger.warn('nuxt-version: package.json does not contain a version')
          return
        }

        const versionSemver = semver.parse(packageJson.version)
        if (!versionSemver) {
          logger.warn('nuxt-version: package.json contains an invalid version')
          return
        }

        if (config?.runtimeConfig?.public) {
          config.runtimeConfig.public.version = versionSemver.toString()
          logger.success('nuxt-version: version set to', config.runtimeConfig.public.version)
        }
      }
      catch (error) {
        logger.error('nuxt-version: error parsing package.json', error)
        return
      }
    })
  },
})
