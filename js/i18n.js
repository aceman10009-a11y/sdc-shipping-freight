/* ==========================================================
   SDC SHIPPING FREIGHT
   MULTILINGUAL SYSTEM
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



let currentLanguage =
    localStorage.getItem("sdc-language")
    || defaultLanguage;



/* ==========================================================
   LOAD TRANSLATION FILE
========================================================== */

async function loadTranslationFile(section){


    try {


        const response = await fetch(
            `locales/${currentLanguage}/${section}.json`
        );


        if(!response.ok){


            console.error(
                `Missing translation file: ${currentLanguage}/${section}.json`
            );


            return {};


        }


        return await response.json();


    }

    catch(error){


        console.error(
            "Translation loading error:",
            error
        );


        return {};


    }


}



/* ==========================================================
   TRANSLATION STORAGE
========================================================== */


let translations = {};



async function loadTranslations(){


    translations = {};


    const files = [

        "layout",
        "common",
        "home",
        "services",
        "about",
        "contact",
        "tracking",
        "errors"

    ];



    for(const file of files){


        translations[file] =
            await loadTranslationFile(file);


    }



    applyTranslations();


    updateLanguageSwitcher();


}



/* ==========================================================
   GET NESTED KEY VALUE
========================================================== */


function getTranslation(path){


    return path

        .split(".")

        .reduce(

            (object,key)=>

            object?.[key],

            translations

        );


}



/* ==========================================================
   APPLY TRANSLATIONS
========================================================== */


function applyTranslations(){



    document

    .querySelectorAll("[data-i18n]")

    .forEach(element=>{



        const key =
            element.dataset.i18n;



        const value =
            getTranslation(key);



        if(value){


            element.innerHTML = value;


        }



    });





    document

    .querySelectorAll("[data-i18n-placeholder]")

    .forEach(element=>{



        const key =
            element.dataset.i18nPlaceholder;



        const value =
            getTranslation(key);



        if(value){


            element.placeholder = value;


        }



    });



}



/* ==========================================================
   CHANGE LANGUAGE
========================================================== */


async function changeLanguage(language){



    if(

        !supportedLanguages.includes(language)

    ){

        return;


    }



    currentLanguage = language;



    localStorage.setItem(

        "sdc-language",

        language

    );



    await loadTranslations();



}



/* ==========================================================
   UPDATE LANGUAGE SWITCHER
========================================================== */


function updateLanguageSwitcher(){



    document

    .querySelectorAll("[data-language]")

    .forEach(button=>{



        if(

            button.dataset.language === currentLanguage

        ){


            button.classList.add("active");


        }

        else{


            button.classList.remove("active");


        }



    });



    const selector =
        document.querySelector("#languageSelect");



    if(selector){


        selector.value = currentLanguage;


    }



}



/* ==========================================================
   START SYSTEM
========================================================== */


document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        loadTranslations();


    }

);