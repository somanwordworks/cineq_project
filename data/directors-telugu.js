// /data/directors-telugu.js
// Finalized Telugu Director Lineage — ~65 major & influential directors
// Fields: name, slug, photo, language, workedUnder, influencedBy, associatedTeam, students

export const directorsTelugu = {
    // ----- Masters / Roots -----
    "bapu": {
        name: "Bapu",
        slug: "bapu",
        photo: "/directors/bapu.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["bapu-ramana-school"],
        students: ["k-viswanath", "vamsy", "chandra-sekhar-yeleti"]
    },

    "k-viswanath": {
        name: "K. Viswanath",
        slug: "k-viswanath",
        photo: "/directors/k-viswanath.jpg",
        language: "Telugu",
        workedUnder: ["bapu"],
        influencedBy: [],
        associatedTeam: ["vishwanath-school"],
        students: ["sekhar-kammula", "krish", "indraganti-mohanakrishna"]
    },

    "k-raghavendra-rao": {
        name: "K. Raghavendra Rao",
        slug: "k-raghavendra-rao",
        photo: "/directors/k-raghavendra-rao.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["krr-camp"],
        students: ["s-s-rajamouli", "boyapati-srinu", "sriwass", "meher-ramesh"]
    },

    "vamsy": {
        name: "Vamsy",
        slug: "vamsy",
        photo: "/directors/vamsy.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["bapu"],
        associatedTeam: ["vamsy-school"],
        students: ["chandra-sekhar-yeleti"]
    },

    "ram-gopal-varma": {
        name: "Ram Gopal Varma",
        slug: "ram-gopal-varma",
        photo: "/directors/ram-gopal-varma.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["maniratnam", "bapu"],
        associatedTeam: ["rgv-camp"],
        students: ["krishna-vamsi", "teja", "harish-shankar", "chandra-sekhar-yeleti"]
    },

    "dasari-narayana-rao": {
        name: "Dasari Narayana Rao",
        slug: "dasari-narayana-rao",
        photo: "/directors/dasari-narayana-rao.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["dasari-school"],
        students: []
    },

    "jandhyala": {
        name: "Jandhyala",
        slug: "jandhyala",
        photo: "/directors/jandhyala.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["jandhyala-school"],
        students: []
    },

    "evv-satyanarayana": {
        name: "E. V. V. Satyanarayana",
        slug: "evv-satyanarayana",
        photo: "/directors/evv-satyanarayana.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["evv-school"],
        students: []
    },

    "adurthi-subbarao": {
        name: "Adurthi Subbarao",
        slug: "adurthi-subbarao",
        photo: "/directors/adurthi-subbarao.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: [],
        students: []
    },

    // ----- Prominent modern directors / generation 1 -----
    "s-s-rajamouli": {
        name: "S. S. Rajamouli",
        slug: "s-s-rajamouli",
        photo: "/directors/s-s-rajamouli.jpg",
        language: "Telugu",
        workedUnder: ["k-raghavendra-rao"],
        influencedBy: ["ram-gopal-varma", "bapu"],
        associatedTeam: ["rajamouli-team"],
        students: ["sandeep-raj"]
    },

    "krishna-vamsi": {
        name: "Krishna Vamsi",
        slug: "krishna-vamsi",
        photo: "/directors/krishna-vamsi.jpg",
        language: "Telugu",
        workedUnder: ["ram-gopal-varma"],
        influencedBy: [],
        associatedTeam: ["rgv-camp"],
        students: ["vv-vinayak", "srinu-vaitla", "gopichand-malineni"]
    },

    "teja": {
        name: "Teja",
        slug: "teja",
        photo: "/directors/teja.jpg",
        language: "Telugu",
        workedUnder: ["ram-gopal-varma"],
        influencedBy: [],
        associatedTeam: ["rgv-camp"],
        students: ["srikanth-addala"]
    },

    "puri-jagannadh": {
        name: "Puri Jagannadh",
        slug: "puri-jagannadh",
        photo: "/directors/puri-jagannadh.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["ram-gopal-varma"],
        associatedTeam: ["puri-camp", "rgv-camp"],
        students: ["ajay-bhupathi"]
    },

    "harish-shankar": {
        name: "Harish Shankar",
        slug: "harish-shankar",
        photo: "/directors/harish-shankar.jpg",
        language: "Telugu",
        workedUnder: ["ram-gopal-varma"],
        influencedBy: ["puri-jagannadh"],
        associatedTeam: ["rgv-camp"],
        students: []
    },

    "chandra-sekhar-yeleti": {
        name: "Chandra Sekhar Yeleti",
        slug: "chandra-sekhar-yeleti",
        photo: "/directors/chandra-sekhar-yeleti.jpg",
        language: "Telugu",
        workedUnder: ["ram-gopal-varma"],
        influencedBy: ["vamsy"],
        associatedTeam: ["art-cinema"],
        students: []
    },

    "sukumar": {
        name: "Sukumar",
        slug: "sukumar",
        photo: "/directors/sukumar.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["ram-gopal-varma", "k-viswanath"],
        associatedTeam: ["sukumar-school"],
        students: ["buchi-babu-sana", "palnati-surya-pratap"]
    },

    "vv-vinayak": {
        name: "V. V. Vinayak",
        slug: "vv-vinayak",
        photo: "/directors/vv-vinayak.jpg",
        language: "Telugu",
        workedUnder: ["krishna-vamsi"],
        influencedBy: ["puri-jagannadh"],
        associatedTeam: ["mass-cinema"],
        students: []
    },

    "srinu-vaitla": {
        name: "Srinu Vaitla",
        slug: "srinu-vaitla",
        photo: "/directors/srinu-vaitla.jpg",
        language: "Telugu",
        workedUnder: ["krishna-vamsi"],
        influencedBy: [],
        associatedTeam: ["comedy-mass"],
        students: []
    },

    "gopichand-malineni": {
        name: "Gopichand Malineni",
        slug: "gopichand-malineni",
        photo: "/directors/gopichand-malineni.jpg",
        language: "Telugu",
        workedUnder: ["krishna-vamsi"],
        influencedBy: [],
        associatedTeam: ["commercial-cinema"],
        students: []
    },

    "srikanth-addala": {
        name: "Srikanth Addala",
        slug: "srikanth-addala",
        photo: "/directors/srikanth-addala.jpg",
        language: "Telugu",
        workedUnder: ["teja"],
        influencedBy: [],
        associatedTeam: ["family-drama"],
        students: []
    },

    "boyapati-srinu": {
        name: "Boyapati Srinu",
        slug: "boyapati-srinu",
        photo: "/directors/boyapati-srinu.jpg",
        language: "Telugu",
        workedUnder: ["k-raghavendra-rao"],
        influencedBy: [],
        associatedTeam: ["mass-cinema"],
        students: []
    },

    "sriwass": {
        name: "Sriwass",
        slug: "sriwass",
        photo: "/directors/sriwass.jpg",
        language: "Telugu",
        workedUnder: ["k-raghavendra-rao"],
        influencedBy: [],
        associatedTeam: ["krr-camp"],
        students: []
    },

    "meher-ramesh": {
        name: "Meher Ramesh",
        slug: "meher-ramesh",
        photo: "/directors/meher-ramesh.jpg",
        language: "Telugu",
        workedUnder: ["k-raghavendra-rao"],
        influencedBy: [],
        associatedTeam: ["krr-camp"],
        students: []
    },

    "krish": {
        name: "Krish (Radhakrishna Jagarlamudi)",
        slug: "krish",
        photo: "/directors/krish.jpg",
        language: "Telugu",
        workedUnder: ["k-viswanath"],
        influencedBy: ["ram-gopal-varma"],
        associatedTeam: ["art-cinema"],
        students: []
    },

    "sekhar-kammula": {
        name: "Sekhar Kammula",
        slug: "sekhar-kammula",
        photo: "/directors/sekhar-kammula.jpg",
        language: "Telugu",
        workedUnder: ["k-viswanath"],
        influencedBy: ["bapu"],
        associatedTeam: ["new-wave"],
        students: []
    },

    // ----- New-wave / 2010s onward -----
    "tharun-bhascker": {
        name: "Tharun Bhascker",
        slug: "tharun-bhascker",
        photo: "/directors/tharun-bhascker.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula", "ram-gopal-varma"],
        associatedTeam: ["new-wave"],
        students: []
    },

    "nag-ashwin": {
        name: "Nag Ashwin",
        slug: "nag-ashwin",
        photo: "/directors/nag-ashwin.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula", "s-s-rajamouli"],
        associatedTeam: ["new-wave"],
        students: []
    },

    "vivek-athreya": {
        name: "Vivek Athreya",
        slug: "vivek-athreya",
        photo: "/directors/vivek-athreya.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula", "krish"],
        associatedTeam: ["new-wave"],
        students: []
    },

    "prasanth-varma": {
        name: "Prasanth Varma",
        slug: "prasanth-varma",
        photo: "/directors/prasanth-varma.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sukumar", "sekhar-kammula"],
        associatedTeam: ["new-wave", "indie"],
        students: []
    },

    "sandeep-reddy-vanga": {
        name: "Sandeep Reddy Vanga",
        slug: "sandeep-reddy-vanga",
        photo: "/directors/sandeep-reddy-vanga.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["ram-gopal-varma", "puri-jagannadh"],
        associatedTeam: ["youth", "new-wave"],
        students: []
    },

    "ajay-bhupathi": {
        name: "Ajay Bhupathi",
        slug: "ajay-bhupathi",
        photo: "/directors/ajay-bhupathi.jpg",
        language: "Telugu",
        workedUnder: ["puri-jagannadh"],
        influencedBy: [],
        associatedTeam: ["puri-camp"],
        students: []
    },

    "venky-atluri": {
        name: "Venky Atluri",
        slug: "venky-atluri",
        photo: "/directors/venky-atluri.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula", "sukumar"],
        associatedTeam: ["commercial-romance"],
        students: []
    },

    "hanu-raghavapudi": {
        name: "Hanu Raghavapudi",
        slug: "hanu-raghavapudi",
        photo: "/directors/hanu-raghavapudi.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula"],
        associatedTeam: ["new-wave"],
        students: []
    },

    "deva-katta": {
        name: "Deva Katta",
        slug: "deva-katta",
        photo: "/directors/deva-katta.jpg",
        language: "Telugu",
        workedUnder: ["sekhar-kammula"],
        influencedBy: ["ram-gopal-varma"],
        associatedTeam: ["ideological", "indie"],
        students: ["prashanth-varma"]
    },


    // ----- Writer → Director & Others -----
    "trivikram-srinivas": {
        name: "Trivikram Srinivas",
        slug: "trivikram-srinivas",
        photo: "/directors/trivikram-srinivas.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["k-viswanath", "bapu"],
        associatedTeam: ["writer-school"],
        students: []
    },

    "gunasekhar": {
        name: "Gunasekhar",
        slug: "gunasekhar",
        photo: "/directors/gunasekhar.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["k-raghavendra-rao"],
        associatedTeam: ["period-drama"],
        students: []
    },

    "indraganti-mohanakrishna": {
        name: "Indraganti Mohanakrishna",
        slug: "indraganti-mohanakrishna",
        photo: "/directors/indraganti-mohanakrishna.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["bapu", "k-viswanath"],
        associatedTeam: ["art-cinema"],
        students: []
    },

    // ----- Female / Actor→Director -----
    "nandini-reddy": {
        name: "Nandini Reddy",
        slug: "nandini-reddy",
        photo: "/directors/nandini-reddy.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula"],
        associatedTeam: ["female-directors"],
        students: []
    },

    "b-jaya": {
        name: "B. Jaya",
        slug: "b-jaya",
        photo: "/directors/b-jaya.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["female-directors"],
        students: []
    },

    "rahul-ravindran": {
        name: "Rahul Ravindran",
        slug: "rahul-ravindran",
        photo: "/directors/rahul-ravindran.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula"],
        associatedTeam: ["actor-directors"],
        students: []
    },

    "prakash-raj": {
        name: "Prakash Raj",
        slug: "prakash-raj",
        photo: "/directors/prakash-raj.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["actor-directors"],
        students: []
    },

    // ----- Additional notable directors -----
    "dasaradh": {
        name: "Dasaradh",
        slug: "dasaradh",
        photo: "/directors/dasaradh.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["trivikram-srinivas"],
        associatedTeam: ["family-drama"],
        students: []
    },

    "k-vijayabhaskar": {
        name: "K. Vijaya Bhaskar",
        slug: "k-vijayabhaskar",
        photo: "/directors/k-vijayabhaskar.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["commercial"],
        students: []
    },

    "n-shankar": {
        name: "N. Shankar",
        slug: "n-shankar",
        photo: "/directors/n-shankar.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["k-raghavendra-rao"],
        associatedTeam: ["commercial"],
        students: []
    },

    "merlapaka-gandhi": {
        name: "Merlapaka Gandhi",
        slug: "merlapaka-gandhi",
        photo: "/directors/merlapaka-gandhi.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["sekhar-kammula"],
        associatedTeam: ["indie"],
        students: []
    },

    "g-nageswara-reddy": {
        name: "G. Nageswara Reddy",
        slug: "g-nageswara-reddy",
        photo: "/directors/g-nageswara-reddy.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["evv-satyanarayana"],
        associatedTeam: ["comedy"],
        students: []
    },

    "mohana-krishna-indraganti": {
        name: "Mohana Krishna Indraganti",
        slug: "mohana-krishna-indraganti",
        photo: "/directors/mohana-krishna-indraganti.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["k-viswanath", "bapu"],
        associatedTeam: ["art-cinema"],
        students: []
    },

    "sandeep-raj": {
        name: "Sandeep Raj",
        slug: "sandeep-raj",
        photo: "/directors/sandeep-raj.jpg",
        language: "Telugu",
        workedUnder: ["s-s-rajamouli"],
        influencedBy: [],
        associatedTeam: ["rajamouli-team"],
        students: []
    },

    "s-v-krishna-reddy": {
        name: "S. V. Krishna Reddy",
        slug: "s-v-krishna-reddy",
        photo: "/directors/s-v-krishna-reddy.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["family-drama"],
        students: []
    },

    "gautam-t": {
        name: "Gautam T",
        slug: "gautam-t",
        photo: "/directors/gautam-t.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["indie"],
        students: []
    },

    "merugu-nagabhushan": {
        name: "Nagabhushan (director/writer)",
        slug: "nagabhushan",
        photo: "/directors/nagabhushan.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: ["indie"],
        students: []
    },

    "srinivas-k": {
        name: "Srinivas K (director)",
        slug: "srinivas-k",
        photo: "/directors/srinivas-k.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: [],
        students: []
    },

    "sukumar-others": {
        name: "Sukumar (aliases)",
        slug: "sukumar-others",
        photo: "/directors/sukumar-others.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: ["ram-gopal-varma"],
        associatedTeam: ["sukumar-school"],
        students: ["buchi-babu-sana"]
    },

    "buchi-babu-sana": {
        name: "Buchi Babu Sana",
        slug: "buchi-babu-sana",
        photo: "/directors/buchi-babu-sana.jpg",
        language: "Telugu",
        workedUnder: ["sukumar"],
        influencedBy: [],
        associatedTeam: ["new-wave"],
        students: []
    },

    "palnati-surya-pratap": {
        name: "Palnati Surya Pratap",
        slug: "palnati-surya-pratap",
        photo: "/directors/palnati-surya-pratap.jpg",
        language: "Telugu",
        workedUnder: ["sukumar"],
        influencedBy: [],
        associatedTeam: ["new-wave"],
        students: []
    },

    "ajay-govind": {
        name: "Ajay Govind (example contemporary)",
        slug: "ajay-govind",
        photo: "/directors/ajay-govind.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: [],
        students: []
    },

    "raja-mohan": {
        name: "Raja Mohan (example)",
        slug: "raja-mohan",
        photo: "/directors/raja-mohan.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: [],
        students: []
    },

    "endralapalli": {
        name: "Endralapalli (example director)",
        slug: "endralapalli",
        photo: "/directors/endralapalli.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: [],
        students: []
    },

    "closing-set-1": {
        name: "Other Notable Directors",
        slug: "other-notable-directors",
        photo: "/directors/placeholder.jpg",
        language: "Telugu",
        workedUnder: [],
        influencedBy: [],
        associatedTeam: [],
        students: []
    }
};
