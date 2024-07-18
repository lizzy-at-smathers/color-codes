#target photoshop

const colorLibrary = getColorLibrary();

var s2t = stringIDToTypeID,
    t2s = typeIDToStringID,
    colorsObj = {},
    colorsArr = [];
    missingColors = [];

// Get all open documents in Photoshop
var documents = app.documents;

// Array to store document names
var documentNames = [];

// Loop through each open document
for (var i = 0; i < documents.length; i++) {
    var doc = documents[i];
    // Get document name and add to array
    documentNames.push(doc.name);
    documentNames.push(fullColorCode());
   /// documentNames.push("\n");
}

// Write document names to a CSV file
var csvFile = File(Folder.desktop.csvFilesName + "/" + activeDocument.name.replace(/\.[0-9a-z]+$/i, '') + '.csv');
csvFile = csvFile.saveDlg('Save file', '*.csv,*.htm');
csvFile.open("w");
csvFile.writeln("Document Names");

for (var j = 0; j < documentNames.length; j++) {
    csvFile.writeln(documentNames[j]);
}

csvFile.close();

// Alert when process completes
alert("Document names saved to CSV file.");



function fullColorCode() {
    (r = new ActionReference()).putProperty(s2t('property'), p = s2t('mode'));
    r.putEnumerated(s2t('document'), s2t('ordinal'), s2t('targetEnum'));
    if (t2s(executeActionGet(r).getEnumerationValue(p)) == 'RGBColor') {
        var f = new File(Folder.temp + '/colors.raw');
        (d = new ActionDescriptor()).putBoolean(s2t("channelsInterleaved"), true);
        d.putBoolean(s2t('copy'), true);
        (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("rawFormat"), d);
        d1.putPath(s2t("in"), f);
        executeAction(s2t("save"), d1, DialogModes.NO);
        f.open('r');
        f.encoding = "BINARY";
        doForcedProgress('Reading colors', 'readColors(f.read(), colorsObj)');
        f.close();
        f.remove();

        //ignore greenscreen
        for (var a in colorsObj) {
            if (a != '933599') { colorsArr.push({ pixels: colorsObj[a], hex: a }) }
        };


        var pixelCounter = 0


        for (var i = 0; i < colorsArr.length; i++) {
            var pixelCounter = pixelCounter + colorsArr[i].pixels
        }
        for (var i = 0; i < colorsArr.length; i++) {
            var swatchColor = colorsArr[i].hex;
            var libEntry = colorLibrary[swatchColor];
            if (libEntry) {
                colorLibrary[swatchColor].stitchCount = colorsArr[i].pixels;
            }
            else{
                missingColors.push("Undefined - " + swatchColor);
            }
        }
        var colorList = [];
        var extantColors = [];
        for (var i in colorLibrary) {
            colorList.push(colorLibrary[i].stitchCount);
        }
        colorList.sort(function (a, b) { return a.Classification - b.Classification });
        for (var i in colorLibrary) {
            extantColors.push(colorLibrary[i].stitchCount / pixelCounter * 100 + '%')
        }
        finalArr = extantColors.toString()
        return finalArr


    }
    
}

function readColors(s, colorsObj) {
    for (var i = 0; i < s.length; i += 3) {
        var cur = toHex(s, i, 3)
        updateProgress(i, s.length)
        if (colorsObj[cur]) colorsObj[cur]++; else colorsObj[cur] = 1;
    }
}

function toHex(s, from, bits) {
    var h = '';
    for (var i = from; i < from + bits; i++) h += (('0' + s.charCodeAt(i).toString(16)).slice(-2));
    return h
}

function deltaE(a, b) {
    return Math.sqrt(Math.pow(b.lab.l - a.lab.l, 2) + Math.pow(b.lab.a - a.lab.a, 2) + Math.pow(b.lab.b - a.lab.b, 2))
}

function getColorLibrary() {
    return {
        'ffffff': {
            name: 'White',
            colorCode: 'Blanc',
            Classification: 1,
            stitchCount: 0,
        },
    
        '000000': {
            name: 'Black',
            colorCode: '310',
            Classification: 2,
            stitchCount: 0,
        },
    
        'e8dcc9': {
            name: 'Light Khaki',
            colorCode: '613',
            Classification: 3,
            stitchCount: 0,
        },
    
        'c8b685': {
            name: 'Dark Khaki',
            colorCode: '612',
            Classification: 4,
            stitchCount: 0,
        },
    
        '9a8e6d': {
            name: 'Taupe',
            colorCode: '611',
            Classification: 5,
            stitchCount: 0,
        },
    
        '98895f': {
            name: 'Taupe',
            colorCode: '610',
            Classification: 6,
            stitchCount: 0,
        },
    
        '7a7056': {
            name: 'Dark Taupe',
            colorCode: '3781',
            Classification: 7,
            stitchCount: 0,
        },
    
        'ece4d9': {
            name: 'Oatmeal',
            colorCode: '3033',
            Classification: 8,
            stitchCount: 0,
        },
    
        'e0dad0': {
            name: 'Stone',
            colorCode: '644',
            Classification: 9,
            stitchCount: 0,
        },
    
        'c5c9b4': {
            name: 'Green Grey',
            colorCode: '3023',
            Classification: 10,
            stitchCount: 0,
        },
    
        'fec7b0': {
            name: 'Light Bermuda Sand',
            colorCode: '353',
            Classification: 11,
            stitchCount: 0,
        },
    
        'f9a391': {
            name: 'Bermuda Sand',
            colorCode: '352',
            Classification: 12,
            stitchCount: 0,
        },
    
        'f67668': {
            name: 'Melon',
            colorCode: '351',
            Classification: 13,
            stitchCount: 0,
        },
    
        'eb5a4b': {
            name: 'Dark Melon',
            colorCode: '350',
            Classification: 14,
            stitchCount: 0,
        },
    
        'c44335': {
            name: 'Rhubarb',
            colorCode: '347',
            Classification: 15,
            stitchCount: 0,
        },
    
        'fa4b4b': {
            name: 'Light Guava',
            colorCode: '3705',
            Classification: 16,
            stitchCount: 0,
        },
    
        'f63c3c': {
            name: 'Guava',
            colorCode: '3801',
            Classification: 17,
            stitchCount: 0,
        },
    
        'e31616': {
            name: 'Bright Red',
            colorCode: '666',
            Classification: 18,
            stitchCount: 0,
        },
    
        'bc0000': {
            name: 'Red',
            colorCode: '321',
            Classification: 19,
            stitchCount: 0,
        },
    
        '980a0a': {
            name: 'Light Garnet',
            colorCode: '816',
            Classification: 20,
            stitchCount: 0,
        },
    
        '740505': {
            name: 'Garnet',
            colorCode: '815',
            Classification: 21,
            stitchCount: 0,
        },
    
        '590505': {
            name: 'Maroon',
            colorCode: '814',
            Classification: 22,
            stitchCount: 0,
        },
    
        'd16c52': {
            name: 'Light Rust',
            colorCode: '356',
            Classification: 23,
            stitchCount: 0,
        },
    
        'af4428': {
            name: 'Rust',
            colorCode: '355',
            Classification: 24,
            stitchCount: 0,
        },
    
        'ab3719': {
            name: 'Deep Rust',
            colorCode: '3777',
            Classification: 25,
            stitchCount: 0,
        },
    
        'fcdee6': {
            name: 'Blush',
            colorCode: '818',
            Classification: 26,
            stitchCount: 0,
        },
    
        'f7b5c3': {
            name: 'Light Pink',
            colorCode: '3716',
            Classification: 27,
            stitchCount: 0,
        },
    
        'f9acc0': {
            name: 'Light Pink',
            colorCode: '604',
            Classification: 28,
            stitchCount: 0,
        },
    
        'f994ae': {
            name: 'Pink',
            colorCode: '603',
            Classification: 29,
            stitchCount: 0,
        },
    
        'f57493': {
            name: 'Dark Pink',
            colorCode: '602',
            Classification: 30,
            stitchCount: 0,
        },
    
        'eb5377': {
            name: 'Hot Pink',
            colorCode: '601',
            Classification: 31,
            stitchCount: 0,
        },
    
        'b52e44': {
            name: 'Cranberry',
            colorCode: '326',
            Classification: 32,
            stitchCount: 0,
        },
    
        'ff9c95': {
            name: 'Pink',
            colorCode: '894',
            Classification: 33,
            stitchCount: 0,
        },
    
        'ff7166': {
            name: 'Pink',
            colorCode: '893',
            Classification: 34,
            stitchCount: 0,
        },
    
        'f9493c': {
            name: 'Watermelon',
            colorCode: '891',
            Classification: 35,
            stitchCount: 0,
        },
    
        'ffaaaa': {
            name: 'Light Pink',
            colorCode: '957',
            Classification: 36,
            stitchCount: 0,
        },
    
        'ff7a7a': {
            name: 'Pink',
            colorCode: '956',
            Classification: 37,
            stitchCount: 0,
        },
    
        'ffc529': {
            name: 'Orange Yellow',
            colorCode: '742',
            Classification: 38,
            stitchCount: 0,
        }
        ,
    
        'ffa729': {
            name: 'Tangerine',
            colorCode: '741',
            Classification: 39,
            stitchCount: 0,
        },
    
        'ff9314': {
            name: 'Orange',
            colorCode: '970',
            Classification: 40,
            stitchCount: 0,
        },
    
        'ff7d14': {
            name: 'Orange',
            colorCode: '947',
            Classification: 41,
            stitchCount: 0,
        },
    
        'f8750c': {
            name: 'Orange',
            colorCode: '946',
            Classification: 42,
            stitchCount: 0,
        },
    
        'fd9129': {
            name: 'Light Spice Orange',
            colorCode: '721',
            Classification: 43,
            stitchCount: 0,
        },
    
        'eb7a1e': {
            name: 'Spice Orange',
            colorCode: '720',
            Classification: 44,
            stitchCount: 0,
        },
    
        'cc6214': {
            name: 'Burnt Orange',
            colorCode: '920',
            Classification: 45,
            stitchCount: 0,
        },
    
        'f05906': {
            name: 'Blood Orange',
            colorCode: '606',
            Classification: 46,
            stitchCount: 0,
        },
    
        'fef37f': {
            name: 'Light Yellow',
            colorCode: '727',
            Classification: 47,
            stitchCount: 0,
        },
    
        'fee74b': {
            name: 'Yellow',
            colorCode: '726',
            Classification: 48,
            stitchCount: 0,
        },
    
        'fcd520': {
            name: 'Yellow',
            colorCode: '725',
            Classification: 49,
            stitchCount: 0,
        },
    
        'fccb20': {
            name: 'Yellow',
            colorCode: '728',
            Classification: 50,
            stitchCount: 0,
        },
    
        'f2b90b': {
            name: 'Mustard Yellow',
            colorCode: '783',
            Classification: 51,
            stitchCount: 0,
        },
    
        'e1a106': {
            name: 'Dark Mustard Yellow',
            colorCode: '782',
            Classification: 52,
            stitchCount: 0,
        },
    
        'be7d0d': {
            name: 'Gold Brown',
            colorCode: '780',
            Classification: 53,
            stitchCount: 0,
        },
    
        'fbd44a': {
            name: 'Yellow Gold',
            colorCode: '3821',
            Classification: 54,
            stitchCount: 0,
        },
    
        'eebe2c': {
            name: 'Yellow Gold',
            colorCode: '3852',
            Classification: 55,
            stitchCount: 0,
        },
    
        'f6e9b1': {
            name: 'Butter',
            colorCode: '677',
            Classification: 56,
            stitchCount: 0,
        },
    
        'edd287': {
            name: 'Light Gold',
            colorCode: '676',
            Classification: 57,
            stitchCount: 0,
        },
    
        'e0be61': {
            name: 'Gold',
            colorCode: '729',
            Classification: 58,
            stitchCount: 0,
        },
    
        'c3a040': {
            name: 'Dark Gold',
            colorCode: '3829',
            Classification: 59,
            stitchCount: 0,
        },
    
        'd3c788': {
            name: 'Gold',
            colorCode: '3046',
            Classification: 60,
            stitchCount: 0,
        },
    
        'baa76c': {
            name: 'Gold',
            colorCode: '3045',
            Classification: 61,
            stitchCount: 0,
        },
    
        'a99352': {
            name: 'Dark Gold',
            colorCode: '167',
            Classification: 62,
            stitchCount: 0,
        },
    
        'd3c397': {
            name: 'Gold',
            colorCode: '422',
            Classification: 63,
            stitchCount: 0,
        },
    
        'ad8c47': {
            name: 'Dark Gold',
            colorCode: '420',
            Classification: 64,
            stitchCount: 0,
        },
    
        'baf2c3': {
            name: 'Wintergreen',
            colorCode: '955',
            Classification: 65,
            stitchCount: 0,
        },
    
        '89dc97': {
            name: 'Mint',
            colorCode: '913',
            Classification: 66,
            stitchCount: 0,
        },
    
        '59cc84': {
            name: 'Light Kelly',
            colorCode: '912',
            Classification: 67,
            stitchCount: 0,
        },
    
        '3fb86c': {
            name: 'Kelly Green',
            colorCode: '911',
            Classification: 68,
            stitchCount: 0,
        },
    
        '239a4f': {
            name: 'Dark Kelly',
            colorCode: '910',
            Classification: 69,
            stitchCount: 0,
        },
    
        '1d8845': {
            name: 'Light Emerald',
            colorCode: '909',
            Classification: 70,
            stitchCount: 0,
        },
    
        '056b2b': {
            name: 'Emerald',
            colorCode: '3818',
            Classification: 71,
            stitchCount: 0,
        },
    
        '8fd855': {
            name: 'Light Lime',
            colorCode: '704',
            Classification: 72,
            stitchCount: 0,
        },
    
        '69b846': {
            name: 'Lime',
            colorCode: '702',
            Classification: 73,
            stitchCount: 0,
        },
    
        '298d21': {
            name: 'Green',
            colorCode: '700',
            Classification: 74,
            stitchCount: 0,
        },
    
        '0f6809': {
            name: 'Dark Green',
            colorCode: '699',
            Classification: 75,
            stitchCount: 0,
        },
    
        '79d331': {
            name: 'Light Yellow Green',
            colorCode: '907',
            Classification: 76,
            stitchCount: 0,
        },
    
        '60bc15': {
            name: 'Yellow Green',
            colorCode: '906',
            Classification: 77,
            stitchCount: 0,
        },
    
        '519718': {
            name: 'Dark Yellow Green',
            colorCode: '905',
            Classification: 78,
            stitchCount: 0,
        },
    
        '51792d': {
            name: 'Olive',
            colorCode: '937',
            Classification: 79,
            stitchCount: 0,
        },
    
        'a0d281': {
            name: 'Light Moss',
            colorCode: '164',
            Classification: 80,
            stitchCount: 0,
        },
    
        '85bb64': {
            name: 'Moss',
            colorCode: '989',
            Classification: 81,
            stitchCount: 0,
        },
    
        '397f3c': {
            name: 'Light Forest Green',
            colorCode: '987',
            Classification: 82,
            stitchCount: 0,
        },
    
        '286c2b': {
            name: 'Forest Green',
            colorCode: '986',
            Classification: 83,
            stitchCount: 0,
        },
    
        '205c22': {
            name: 'Dark Forest Green',
            colorCode: '895',
            Classification: 84,
            stitchCount: 0,
        },
    
        '1a471c': {
            name: 'Hunter',
            colorCode: '319',
            Classification: 85,
            stitchCount: 0,
        },
    
        '164018': {
            name: 'Deep Hunter',
            colorCode: '890',
            Classification: 86,
            stitchCount: 0,
        },
    
        '89bb8b': {
            name: 'Light Sage',
            colorCode: '368',
            Classification: 87,
            stitchCount: 0,
        },
    
        '486d49': {
            name: 'Sage',
            colorCode: '367',
            Classification: 88,
            stitchCount: 0,
        },
    
        '71bd99': {
            name: 'Seafoam',
            colorCode: '3816',
            Classification: 89,
            stitchCount: 0,
        },
    
        '57aa6b': {
            name: 'Light Fern',
            colorCode: '562',
            Classification: 90,
            stitchCount: 0,
        },
    
        '459558': {
            name: 'Fern',
            colorCode: '505',
            Classification: 91,
            stitchCount: 0,
        },
    
        '3a6d48': {
            name: 'Antique Green',
            colorCode: '501',
            Classification: 92,
            stitchCount: 0,
        },
    
        '184326': {
            name: 'Dark Pine',
            colorCode: '500',
            Classification: 93,
            stitchCount: 0,
        },
    
        '93eed3': {
            name: 'Sea Green',
            colorCode: '964',
            Classification: 94,
            stitchCount: 0,
        },
    
        '3dc39b': {
            name: 'Light Tropical Green',
            colorCode: '3851',
            Classification: 95,
            stitchCount: 0,
        },
    
        '00a182': {
            name: 'Tropical Green',
            colorCode: '3850',
            Classification: 96,
            stitchCount: 0,
        },
    
        '67caa4': {
            name: 'Light Jade',
            colorCode: '992',
            Classification: 97,
            stitchCount: 0,
        },
    
        '11846d': {
            name: 'Jade',
            colorCode: '991',
            Classification: 98,
            stitchCount: 0,
        },
    
        '3cd7d2': {
            name: 'Aqua',
            colorCode: '3846',
            Classification: 99,
            stitchCount: 0,
        },
    
        '0ba9b7': {
            name: 'Dark Aqua',
            colorCode: '3844',
            Classification: 100,
            stitchCount: 0,
        },
    
        'd5fbfc': {
            name: 'Very Light Teal',
            colorCode: '747',
            Classification: 101,
            stitchCount: 0,
        },
    
        '94cce4': {
            name: 'Sky Blue',
            colorCode: '519',
            Classification: 102,
            stitchCount: 0,
        },
    
        '75bbc5': {
            name: 'Teal',
            colorCode: '807',
            Classification: 103,
            stitchCount: 0,
        },
    
        '65afb1': {
            name: 'Turquoise',
            colorCode: '3810',
            Classification: 104,
            stitchCount: 0,
        },
    
        '085d71': {
            name: 'Dark Turquoise',
            colorCode: '3808',
            Classification: 105,
            stitchCount: 0,
        },
    
        '224980': {
            name: 'Blueberry',
            colorCode: '312',
            Classification: 106,
            stitchCount: 0,
        },
    
        '1e2e5a': {
            name: 'Classic Navy',
            colorCode: '336',
            Classification: 107,
            stitchCount: 0,
        },
    
        '10153f': {
            name: 'Dark Navy',
            colorCode: '823',
            Classification: 108,
            stitchCount: 0,
        },
    
        '0c1034': {
            name: 'Midnight',
            colorCode: '939',
            Classification: 109,
            stitchCount: 0,
        },
    
        'abd3ef': {
            name: 'Ice Blue',
            colorCode: '827',
            Classification: 110,
            stitchCount: 0,
        },
    
        '8cbddf': {
            name: 'Light Blue',
            colorCode: '813',
            Classification: 111,
            stitchCount: 0,
        },
    
        '5c95d4': {
            name: 'Cornflower',
            colorCode: '826',
            Classification: 112,
            stitchCount: 0,
        },
    
        '2962a2': {
            name: 'Blue',
            colorCode: '825',
            Classification: 113,
            stitchCount: 0,
        },
    
        '184481': {
            name: 'Dark Blue',
            colorCode: '824',
            Classification: 114,
            stitchCount: 0,
        },
    
        '6791d0': {
            name: 'Stream Blue',
            colorCode: '322',
            Classification: 115,
            stitchCount: 0,
        },
    
        '76a5e5': {
            name: 'Baby Blue',
            colorCode: '799',
            Classification: 116,
            stitchCount: 0,
        },
    
        '3e74d8': {
            name: 'Cobalt',
            colorCode: '798',
            Classification: 117,
            stitchCount: 0,
        },
    
        '425bc5': {
            name: 'Royal',
            colorCode: '797',
            Classification: 118,
            stitchCount: 0,
        },
    
        '2756be': {
            name: 'Dark Royal',
            colorCode: '796',
            Classification: 119,
            stitchCount: 0,
        },
    
        '53aef5': {
            name: 'Azure',
            colorCode: '996',
            Classification: 120,
            stitchCount: 0,
        },
    
        '2a9af0': {
            name: 'Bright Blue',
            colorCode: '3843',
            Classification: 121,
            stitchCount: 0,
        },
    
        '007ad0': {
            name: 'Electric Blue',
            colorCode: '995',
            Classification: 122,
            stitchCount: 0,
        },
    
        'cedce5': {
            name: 'Powder Blue',
            colorCode: '3753',
            Classification: 123,
            stitchCount: 0,
        },
    
        '9cb9cc': {
            name: 'Antique Blue',
            colorCode: '932',
            Classification: 124,
            stitchCount: 0,
        },
    
        '5e829a': {
            name: 'Steel Blue',
            colorCode: '931',
            Classification: 125,
            stitchCount: 0,
        },
    
        '3b6078': {
            name: 'Slate',
            colorCode: '930',
            Classification: 126,
            stitchCount: 0,
        },
    
        'e6b1f1': {
            name: 'Lavender',
            colorCode: '554',
            Classification: 127,
            stitchCount: 0,
        },
    
        '9f89d7': {
            name: 'Violet',
            colorCode: '155',
            Classification: 128,
            stitchCount: 0,
        },
    
        '7859c6': {
            name: 'Purple',
            colorCode: '333',
            Classification: 129,
            stitchCount: 0,
        },
    
        '37277e': {
            name: 'Indigo Purple',
            colorCode: '791',
            Classification: 130,
            stitchCount: 0,
        },
    
        '7377a8': {
            name: 'Periwinkle',
            colorCode: '3807',
            Classification: 131,
            stitchCount: 0,
        },
    
        'a85bb9': {
            name: 'Amethyst',
            colorCode: '552',
            Classification: 132,
            stitchCount: 0,
        },
    
        '5f138a': {
            name: 'Royal Purple',
            colorCode: '550',
            Classification: 133,
            stitchCount: 0,
        },
    
        '511b3f': {
            name: 'Eggplant',
            colorCode: '154',
            Classification: 134,
            stitchCount: 0,
        },
    
        'bd7777': {
            name: 'Marsala',
            colorCode: '223',
            Classification: 135,
            stitchCount: 0,
        },
    
        '99294e': {
            name: 'Dark Mauve',
            colorCode: '3803',
            Classification: 136,
            stitchCount: 0,
        },
    
        'f7dec0': {
            name: 'Skin',
            colorCode: '945',
            Classification: 137,
            stitchCount: 0,
        },
    
        'd1a588': {
            name: 'Dark Skin',
            colorCode: '3064',
            Classification: 138,
            stitchCount: 0,
        },
    
        'f6efdf': {
            name: 'Off White',
            colorCode: '712',
            Classification: 139,
            stitchCount: 0,
        },
    
        'eedfbb': {
            name: 'Cream',
            colorCode: '739',
            Classification: 140,
            stitchCount: 0,
        },
    
        'e2c48b': {
            name: 'Tan',
            colorCode: '738',
            Classification: 141,
            stitchCount: 0,
        },
    
        'd9b267': {
            name: 'Tan',
            colorCode: '437',
            Classification: 142,
            stitchCount: 0,
        },
    
        'c79444': {
            name: 'Light Brown',
            colorCode: '436',
            Classification: 143,
            stitchCount: 0,
        },
    
        'b98138': {
            name: 'Light Brown 2',
            colorCode: '435',
            Classification: 144,
            stitchCount: 0,
        },
    
        '996520': {
            name: 'Brown',
            colorCode: '434',
            Classification: 145,
            stitchCount: 0,
        },
    
        '82571e': {
            name: 'Brown',
            colorCode: '433',
            Classification: 146,
            stitchCount: 0,
        },
    
        '6e4919': {
            name: 'Brown',
            colorCode: '801',
            Classification: 147,
            stitchCount: 0,
        },
    
        '5e3c0f': {
            name: 'Brown',
            colorCode: '898',
            Classification: 148,
            stitchCount: 0,
        },
    
        '563914': {
            name: 'Dark Brown',
            colorCode: '938',
            Classification: 149,
            stitchCount: 0,
        },
    
        '32200a': {
            name: 'Very Dark Brown',
            colorCode: '3371',
            Classification: 150,
            stitchCount: 0,
        },
    
        'f9b164': {
            name: 'Peach',
            colorCode: '402',
            Classification: 151,
            stitchCount: 0,
        },
    
        'c87822': {
            name: 'Ginger',
            colorCode: '976',
            Classification: 152,
            stitchCount: 0,
        },
    
        'a3591e': {
            name: 'Copper',
            colorCode: '301',
            Classification: 153,
            stitchCount: 0,
        },
    
        '743b09': {
            name: 'Chestnut',
            colorCode: '300',
            Classification: 154,
            stitchCount: 0,
        },
    
        'e8e8e8': {
            name: 'Very Light Grey',
            colorCode: '762',
            Classification: 155,
            stitchCount: 0,
        },
    
        'd2d2d2': {
            name: 'Light Grey',
            colorCode: '415',
            Classification: 156,
            stitchCount: 0,
        },
    
        'b9b9b9': {
            name: 'Grey',
            colorCode: '318',
            Classification: 157,
            stitchCount: 0,
        },
    
        '9b9b9b': {
            name: 'Grey',
            colorCode: '414',
            Classification: 158,
            stitchCount: 0,
        },
    
        '777777': {
            name: 'Dark Grey',
            colorCode: '317',
            Classification: 159,
            stitchCount: 0,
        },
    
        '4b4b4b': {
            name: 'Charcoal',
            colorCode: '3799',
            Classification: 160,
            stitchCount: 0,
        },
    
        'c3cfcd': {
            name: 'Light Silver Grey',
            colorCode: '168',
            Classification: 161,
            stitchCount: 0,
        },
    
        'a5b0ae': {
            name: 'Silver Grey',
            colorCode: '169',
            Classification: 162,
            stitchCount: 0,
        },
    
        'cac7b9': {
            name: 'Light Beaver Grey',
            colorCode: '648',
            Classification: 163,
            stitchCount: 0,
        },
    
        '928f7e': {
            name: 'Beaver Grey',
            colorCode: '646',
            Classification: 164,
            stitchCount: 0,
        },
    
        '827f6f': {
            name: 'Beaver Grey',
            colorCode: '645',
            Classification: 165,
            stitchCount: 0,
        },
    
        '56544b': {
            name: 'Dark Beaver Grey',
            colorCode: '844',
            Classification: 166,
            stitchCount: 0,
        },
    
        'bdc9a2': {
            name: 'Corn Husk',
            colorCode: '3013',
            Classification: 167,
            stitchCount: 0,
        },
    
        'c2c78f': {
            name: 'Green Gold',
            colorCode: '372',
            Classification: 168,
            stitchCount: 0,
        },
    
        'b1b67c': {
            name: 'Green Gold',
            colorCode: '370',
            Classification: 169,
            stitchCount: 0,
        },
    };
}
