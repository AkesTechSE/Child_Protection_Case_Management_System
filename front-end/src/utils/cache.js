const CACHE_PREFIX = 'cpms_cache::'
const memoryCache = new Map()
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return window.sessionStorage
  } catch (error) {
    console.warn('Session storage unavailable, falling back to memory cache.', error)
    return null
  }
}

const makeKey = (key) => `${CACHE_PREFIX}${key}`

export const readCache = (key, ttl = DEFAULT_CACHE_TTL) => {
  const now = Date.now()
  const storage = getStorage()
  if (storage) {
    try {
      const raw = storage.getItem(makeKey(key))
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!parsed?.timestamp || now - parsed.timestamp > ttl) {
        storage.removeItem(makeKey(key))
        return null
      }
      return parsed.value
    } catch (error) {
      storage.removeItem(makeKey(key))
      return null
    }
  }

  const entry = memoryCache.get(key)
  if (!entry || now - entry.timestamp > ttl) {
    memoryCache.delete(key)
    return null
  }
  return entry.value
}

export const writeCache = (key, value) => {
  const entry = {
    timestamp: Date.now(),
    value
  }

  const storage = getStorage()
  if (storage) {
    try {
      storage.setItem(makeKey(key), JSON.stringify(entry))
      return
    } catch (error) {
      storage.removeItem(makeKey(key))
    }
  }

  memoryCache.set(key, entry)
}

export const invalidateCacheKey = (key) => {
  const storage = getStorage()
  if (storage) {
    storage.removeItem(makeKey(key))
  }
  memoryCache.delete(key)
}

export const invalidateCacheGroup = (prefix) => {
  const storage = getStorage()
  const storageKeysToRemove = []

  if (storage) {
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i)
      if (key && key.startsWith(makeKey(prefix))) {
        storageKeysToRemove.push(key)
      }
    }
    storageKeysToRemove.forEach((key) => storage.removeItem(key))
  }

  Array.from(memoryCache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key)
    }
  })
}
