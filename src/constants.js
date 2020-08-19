exports.environment = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

exports.is_dev = exports.environment === "development"
exports.is_test = exports.environment === "test"

exports.languages = exports.is_dev ? {
    'ENGLISH': { base_url: 'en' },
} : {
    'ENGLISH': { base_url: 'en' },
    'SPANISH': { base_url: 'es' },
    'FRENCH': { base_url: 'fr' },
    'GERMAN': { base_url: 'de' },
    'CHINESE': { base_url: 'zh' },
    'JAPANESE': { base_url: 'ja' },
    'RUSSIAN': { base_url: 'ru' },
}

exports.query_page_limit = exports.is_dev ? 10 : Number.MAX_SAFE_INTEGER