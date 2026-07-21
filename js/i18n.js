/* ==========================================================
   SDC SHIPPING FREIGHT
   INTERNATIONALIZATION SYSTEM
========================================================== */

const supportedLanguages = [
    "en",
    "fr",
    "de",
    "es",
    "it",
    "pt",
    "nl",
    "pl",
    "cs",
    "da",
    "sv",
    "no",
    "fi",
    "ro",
    "uk",
    "ru",
    "tr",
    "ar",
    "zh",
    "ja",
    "ko",
    "th",
    "vi",
    "ms"
];

const defaultLanguage = "en";

const translationFiles = [
    "layout",
    "common",
    "home",
    "services",
    "about",
    "contact",
    "tracking",
    "errors"
];

let translations = {};

let currentLanguage =
    localStorage.getItem("sdc-language");

if (
    !currentLanguage ||
    !supportedLanguages.includes(currentLanguage)
) {
    currentLanguage = defaultLanguage;
}

/* ==========================================================
   LOAD SINGLE JSON FILE
========================================================== */

async function loadTranslationFile(language, file) {

    try {

        const response = await fetch(

            `locales/${language}/${file}.json`,

            {
                cache: "no-cache"
            }

        );

        if (!response.ok) {

            console.error(

                `Missing translation file: ${language}/${file}.json`

            );

            return {};

        }

        return await response.json();

    }

    catch (error) {

        console.error(

            "Translation loading failed:",

            error

        );

        return {};

    }

}

/* ==========================================================
   LOAD ALL TRANSLATIONS
========================================================== */

async function loadTranslations(language = currentLanguage) {

    console.log(

        "Loading language:",

        language

    );

    const loadedTranslations = {};

    const requests = translationFiles.map(

        file => loadTranslationFile(

            language,

            file

        )

    );

    const results = await Promise.all(requests);

    translationFiles.forEach(

        (file, index) => {

            loadedTranslations[file] = results[index];

        }

    );

    translations = loadedTranslations;

    window.translations = translations;

    currentLanguage = language;

    localStorage.setItem(

        "sdc-language",

        language

    );

    applyTranslations();

    updateLanguageSelector();

}

/* ==========================================================
   GET TRANSLATION
========================================================== */

function getTranslation(path) {

    return path

        .split(".")

        .reduce(

            (object, key) =>

                object?.[key],

            translations

        );

}
/* ==========================================================
   APPLY TRANSLATIONS
========================================================== */

function applyTranslations() {

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            const value =
                getTranslation(key);

            if (value !== undefined) {

                /*
                 * Only use innerHTML when the
                 * translation intentionally contains HTML.
                 */

                if (
                    value.includes("<") &&
                    value.includes(">")
                ) {

                    element.innerHTML = value;

                } else {

                    element.textContent = value;

                }

            }

            else {

                console.warn(

                    "Missing translation:",

                    key

                );

            }

        });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {

            const key =
                element.dataset.i18nPlaceholder;

            const value =
                getTranslation(key);

            if (value !== undefined) {

                element.placeholder = value;

            }

        });

}

/* ==========================================================
   UPDATE LANGUAGE SELECTOR
========================================================== */

function updateLanguageSelector() {

    const selector =
        document.getElementById(
            "languageSelect"
        );

    if (selector) {

        selector.value =
            currentLanguage;

    }

}

/* ==========================================================
   CHANGE LANGUAGE
========================================================== */

async function changeLanguage(language) {

    if (
        !supportedLanguages.includes(language)
    ) {

        return;

    }

    if (
        language === currentLanguage
    ) {

        return;

    }

    await loadTranslations(language);

}

/* ==========================================================
   OBSERVE DOM CHANGES
========================================================== */

const translationObserver =

    new MutationObserver(() => {

        applyTranslations();

    });

/* ==========================================================
   START SYSTEM
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await loadTranslations(currentLanguage);

        translationObserver.observe(

            document.body,

            {

                childList: true,

                subtree: true

            }

        );

        console.log(

            "SDC Translation System Ready",

            currentLanguage

        );

    }

);

/* ==========================================================
   PUBLIC API
========================================================== */

window.changeLanguage =
    changeLanguage;

window.getTranslation =
    getTranslation;