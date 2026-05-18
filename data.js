/* ===========================
   TEXT DATA & CONTENT
   =========================== */

const textData = {
    english: {
        beginner: {
            words: [
                'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
                'hello', 'world', 'javascript', 'typing', 'code', 'computer',
                'speed', 'test', 'practice', 'improve', 'skills', 'keyboard',
                'fast', 'slow', 'good', 'great', 'awesome', 'amazing', 'nice',
                'happy', 'tired', 'ready', 'start', 'begin', 'end', 'finish',
                'cat', 'dog', 'bird', 'fish', 'tree', 'flower', 'sun', 'moon',
                'star', 'sky', 'cloud', 'rain', 'snow', 'wind', 'water', 'fire'
            ],
            sentences: [
                'The quick brown fox jumps over the lazy dog.',
                'Hello world, this is a typing test.',
                'Practice makes perfect in typing.',
                'Keyboard skills are important for productivity.',
                'Keep your fingers on the home row.',
                'Type faster and improve your accuracy.',
                'Enjoy the typing challenge.',
                'This is a great way to train your fingers.'
            ],
            paragraphs: [
                'Typing is a fundamental skill in the modern world. Whether you are writing emails, creating documents, or coding, the ability to type quickly and accurately is invaluable. Regular practice with typing tests can help you improve your speed and reduce errors.',
                'The home row of the keyboard is your starting position. Your left hand should rest on A, S, D, F while your right hand rests on J, K, L, and semicolon. This proper positioning is the foundation of touch typing.'
            ]
        },
        intermediate: {
            words: [
                'development', 'infrastructure', 'organization', 'responsibility',
                'algorithm', 'database', 'framework', 'implementation', 'authentication',
                'optimization', 'configuration', 'integration', 'performance',
                'experience', 'opportunity', 'achievement', 'challenge', 'solution',
                'technology', 'innovation', 'application', 'environment', 'essential',
                'professional', 'necessary', 'comprehensive', 'systematic', 'continuous',
                'efficient', 'effective', 'productive', 'interactive', 'sophisticated'
            ],
            sentences: [
                'Learning to type efficiently is an essential skill for any professional.',
                'Consistent practice and proper technique lead to significant improvements.',
                'The keyboard layout becomes second nature with dedicated training.',
                'Understanding finger positioning prevents injury and improves speed.',
                'Many people underestimate the importance of typing accuracy.',
                'A typing speed of 60-80 words per minute is considered professional.',
                'Online typing tests provide immediate feedback and motivation.'
            ],
            paragraphs: [
                'Touch typing is a method where typists do not look at the keyboard while typing. This skill requires practice and muscle memory development. The ability to type without looking at the keyboard significantly increases both speed and accuracy. Professional typists can maintain speeds above 100 words per minute with minimal errors.',
                'Modern technology has made typing more important than ever. From smartphones to laptops, typing is the primary method of input. Developing strong typing skills early in life provides long-term benefits for academic and professional success.'
            ]
        },
        advanced: {
            words: [
                'serendipitous', 'ambidextrous', 'juxtaposition', 'perspicacious',
                'ubiquitous', 'ephemeral', 'mellifluous', 'obfuscate', 'quintessential',
                'eloquence', 'meticulous', 'paradigm', 'nostalgia', 'euphoria',
                'cacophony', 'benevolent', 'pragmatic', 'metaphorical', 'paradox',
                'phenomenon', 'psychology', 'archaeology', 'philosophy', 'photosynthesis',
                'entrepreneurship', 'sustainability', 'aesthetics', 'bibliophile',
                'onomatopoeia', 'pseudonym', 'hypothesis', 'synthesis'
            ],
            sentences: [
                'The serendipitous discovery of the ancient manuscript proved to be quintessential for understanding that era\'s culture.',
                'Her eloquence and perspicacious remarks captivated the entire auditorium.',
                'The juxtaposition of modern architecture with historical buildings created an aesthetically compelling cityscape.',
                'His pragmatic approach to problem-solving proved both efficacious and cost-effective.',
                'The cacophony of urban life contrasted sharply with the mellifluous sounds of nature.',
                'Technology has become ubiquitous in contemporary society, fundamentally altering how we communicate.'
            ],
            paragraphs: [
                'The serendipitous convergence of scientific innovation, technological advancement, and societal need has fundamentally transformed our world. From groundbreaking pharmaceutical discoveries to revolutionary computational methodologies, humanity\'s capacity for ingenuity continues to astound. Yet, this paradox persists: as our knowledge expands exponentially, our comprehension of the universe\'s most fundamental mysteries remains elusive and enigmatic.',
                'Linguistic evolution represents one of humanity\'s most captivating yet underappreciated phenomena. The metamorphosis of language across millennia, continents, and cultures reflects our collective consciousness and values. Contemporary philologists and etymologists meticulously analyze linguistic genealogies, unveiling intricate interconnections between seemingly disparate tongues, thereby illuminating the profound interdependence of human civilizations.'
            ]
        }
    },
    hindi: {
        beginner: {
            words: [
                'नमस्ते', 'दुनिया', 'कंप्यूटर', 'टाइपिंग', 'कोड', 'स्पीड',
                'तेज', 'धीमा', 'अच्छा', 'बुरा', 'सुंदर', 'बदसूरत',
                'बिल्ली', 'कुत्ता', 'पक्षी', 'मछली', 'पेड़', 'फूल',
                'सूरज', 'चाँद', 'तारा', 'आकाश', 'बादल', 'बारिश',
                'हवा', 'आग', 'पानी', 'मिट्टी', 'खुश', 'दुःख'
            ],
            sentences: [
                'नमस्ते, यह एक टाइपिंग टेस्ट है।',
                'कीबोर्ड पर तेजी से टाइप करें।',
                'अभ्यास से परफेक्शन आती है।',
                'यह एक अच्छा तरीका है अपने कौशल सुधारने का।',
                'टाइपिंग आधुनिक दुनिया का एक महत्वपूर्ण कौशल है।'
            ],
            paragraphs: [
                'टाइपिंग आज के समय में एक जरूरी कौशल है। चाहे आप ईमेल लिखें, दस्तावेज बनाएं या कोडिंग करें, तेजी और सटीकता से टाइप करना महत्वपूर्ण है।'
            ]
        },
        intermediate: {
            words: [
                'विकास', 'संरचना', 'संगठन', 'जिम्मेदारी', 'एल्गोरिथम',
                'डेटाबेस', 'फ्रेमवर्क', 'कार्यान्वयन', 'सत्यापन', 'अनुकूलन',
                'विन्यास', 'एकीकरण', 'कार्यक्षमता', 'अनुभव', 'अवसर',
                'उपलब्धि', 'चुनौती', 'समाधान', 'तकनीक', 'नवाचार'
            ],
            sentences: [
                'कंप्यूटर विज्ञान में दक्षता आवश्यक है।',
                'सही तकनीक से टाइपिंग की गति बढ़ती है।',
                'नियमित अभ्यास से बेहतर परिणाम मिलते हैं।',
                'डिजिटल युग में ये कौशल बहुत महत्वपूर्ण है।',
                'सफलता के लिए निरंतर सुधार आवश्यक है।'
            ],
            paragraphs: [
                'आधुनिक समय में कंप्यूटर कौशल सभी के लिए आवश्यक हो गए हैं। टाइपिंग की गति और सटीकता व्यावसायिक सफलता के लिए बहुत महत्वपूर्ण है। नियमित अभ्यास से आप अपनी क्षमता में उल्लेखनीय सुधार कर सकते हैं।'
            ]
        },
        advanced: {
            words: [
                'अप्रत्याशित', 'दक्षतापूर्वक', 'विरोधाभास', 'सुस्पष्ट', 'सर्वव्यापी',
                'क्षणिक', 'मधुर', 'अस्पष्ट', 'सार्वभौमिक', 'आध्यात्मिक',
                'दार्शनिक', 'आश्चर्यजनक', 'तकनीकी', 'बहुमुखी', 'महत्त्वपूर्ण',
                'प्रतिष्ठित', 'परिष्कृत', 'अभूतपूर्व', 'बौद्धिक', 'अनुभवजन्य'
            ],
            sentences: [
                'प्रौद्योगिकी का विकास असाधारण गति से हो रहा है।',
                'ज्ञान और कौशल की आवश्यकता निरंतर बढ़ रही है।',
                'सफलता के लिए दक्षता और समर्पण अत्यंत आवश्यक है।',
                'आधुनिक विश्व में डिजिटल साक्षरता अनिवार्य हो गई है।'
            ],
            paragraphs: [
                'मानव सभ्यता का विकास तकनीकी प्रगति के साथ जुड़ा हुआ है। कंप्यूटर और इंटरनेट ने विश्व को एक परिवार में बदल दिया है। इस परिवर्तनशील दुनिया में सफल होने के लिए निरंतर सीखना और कौशल विकास अत्यावश्यक है।'
            ]
        }
    },
    quotes: {
        english: [
            'The early bird catches the worm.',
            'Actions speak louder than words.',
            'Knowledge is power.',
            'Time flies when you are having fun.',
            'Two heads are better than one.',
            'You miss 100% of the shots you do not take.'
        ],
        hindi: [
            'ज्ञान ही शक्ति है।',
            'समय ही धन है।',
            'मेहनत कभी बेकार नहीं जाती।',
            'अभ्यास से सिद्धि मिलती है।',
            'जहाँ चाह वहाँ राह।',
            'आशा ही जीवन है।'
        ]
    }
};

/**
 * Get random text based on mode, difficulty, and language
 */
function getRandomText(mode = 'words', difficulty = 'intermediate', language = 'english') {
    const lang = language === 'hindi' ? 'hindi' : 'english';
    const level = ['beginner', 'intermediate', 'advanced'].includes(difficulty) ? difficulty : 'intermediate';
    const data = textData[lang][level];

    if (!data) {
        return 'Unable to load text. Please refresh the page.';
    }

    let textArray = [];

    if (mode === 'words') {
        // Generate 50-80 words
        const count = Math.random() > 0.5 ? 50 : 60;
        for (let i = 0; i < count; i++) {
            textArray.push(data.words[Math.floor(Math.random() * data.words.length)]);
        }
        return textArray.join(' ');
    } else if (mode === 'sentences') {
        // Generate 3-5 sentences
        const count = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < count; i++) {
            textArray.push(data.sentences[Math.floor(Math.random() * data.sentences.length)]);
        }
        return textArray.join(' ');
    } else if (mode === 'paragraph') {
        // Return 1-2 paragraphs
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
            textArray.push(data.paragraphs[Math.floor(Math.random() * data.paragraphs.length)]);
        }
        return textArray.join(' ');
    }

    return textArray.join(' ');
}

/**
 * Get a random quote
 */
function getRandomQuote(language = 'english') {
    const lang = language === 'hindi' ? 'hindi' : 'english';
    const quotes = textData.quotes[lang];
    return quotes[Math.floor(Math.random() * quotes.length)];
}
