export type Language = 'en' | 'hi' | 'te';

export const translations = {
    en: {
        nav: {
            schemes: "Schemes",
            volunteer: "Volunteer",
            admin: "Admin",
            profile: "Profile",
            logout: "Logout",
            login: "Login",
            getStarted: "Get Started",
            resources: "Resources"
        },
        admin: {
            title: "Governance Intelligence",
            subtitle: "Real-time engagement metrics and scheme funnel analysis.",
            seedRepo: "SEED REPOSITORY",
            exportReport: "EXPORT REPORT",
            totalAssessed: "Total Assessed",
            matchesFound: "Matches Found",
            activeFunnel: "Active Funnel",
            docReadiness: "Doc Readiness",
            regionalBridge: "Regional Welfare Bridge",
            bridgeDesc: "Analyzing the conversion gap between scheme interest and benefit delivery.",
            engagementFunnel: "Engagement Funnel",
            livePerformance: "Live Performance",
            funnelDesc: "User journey from discovery to benefit receipt.",
            dropOffAnalysis: "Drop-off Analysis",
            dropOffDesc: "Primary reasons for ineligibility.",
            actionRecommended: "Action Recommended:",
            incomeLimitNotice: "High drop-off due to income limits suggests a need for middle-income specific programs.",
            directory: {
                title: "Citizen Directory",
                desc: "Manage and monitor registered citizen profiles and their eligibility status.",
                search: "Search citizens...",
                filter: "Filter",
                loading: "Loading Database...",
                thCitizen: "Citizen",
                thDemographics: "Demographics",
                thStatus: "Status",
                thActivity: "Recent Activity",
                verified: "Verified",
                pending: "Pending",
                anonymous: "Anonymous User",
                noEmail: "No email provided",
                noActivity: "No check history",
                noResults: "No citizens found"
            },
            analytics: {
                title: "Analytics Hub",
                desc: "Deep-dive into demographic trends, scheme adoption, and regional performance.",
                last30Days: "LAST 30 DAYS",
                exportReport: "EXPORT REPORT",
                volumeTrends: "Volume Trends",
                volumeDesc: "Monthly application vs verification growth.",
                ageDemographics: "Age Demographics",
                ageDesc: "Population distribution by age groups.",
                incomeBreakdown: "Income Breakdown",
                incomeDesc: "Distribution across economic segments.",
                applications: "Applications",
                verifiedStat: "Verified"
            }
        },
        hero: {
            badge: "Official Digital Welfare Portal",
            title: "Welfare Access.",
            subtitle: "Total Privacy.",
            description: "Discover and verify your eligibility for central and state schemes entirely in your browser. No data stays on our servers.",
            cta: "CHECK MY ELIGIBILITY",
            explore: "EXPLORE ALL SCHEMES"
        },
        roles: {
            citizen: {
                title: "State Citizens",
                desc: "Verify eligibility local-first. We scan your documents without storing a single byte of your identity.",
                cta: "Start Verification"
            },
            volunteer: {
                title: "Field Volunteers",
                desc: "Enable last-mile delivery of government services. Support families in remote regions with local processing.",
                cta: "Open Portal"
            },
            admin: {
                title: "Governance Intelligence",
                desc: "Real-time engagement metrics and scheme funnel analysis.",
                cta: "Open Portal"
            }
        },
        trust: {
            title: "Security by Architecture.",
            subtitle: "We built CitizenDesk to ensure that the most sensitive data in the world — your documents — never leave your hands.",
            items: {
                ocr: { title: "Local-Only OCR", desc: "Document scanning happens 100% on your device using WebWorkers." },
                logs: { title: "Zero Session Log", desc: "We don't log your files, your face, or your ID numbers. Not even for a second." },
                tokens: { title: "Instant Tokens", desc: "Once verified, you get an encrypted token to prove eligibility to agencies." },
                public: { title: "Public Trust", desc: "Built to bridge the gap between complex policies and the people they serve." }
            }
        },
        schemes: {
            title: "Welfare Explorer",
            subtitle: "Access central and state programs with verified eligibility tokens.",
            recommended: "Recommended for You",
            all: "Discover All Schemes",
            personalize: "PERSONALIZE RESULTS",
            searchPlaceholder: "Search by keywords...",
            loading: "Sourcing Schemes..."
        },
        check: {
            title: "Eligibility Checker",
            prediction: {
                title: "Predictive Intelligence",
                subtitle: "Eligibility Forecast",
                badge: "LIVE AI DATA",
                ageTitle: "Age Milestones",
                incomeTitle: "Income Alignment",
                docTitle: "Document Readiness",
                confidence: "Confidence Path",
                timeToTarget: "Time to Target"
            },
            profile: "Personal Profile",
            profileDesc: "Accurate details help us find the best matching welfare programs.",
            matches: "Personalized Matches",
            matchesDesc: "We found {count} programs for your profile.",
            form: {
                demographics: "Demographics",
                name: "Full Name",
                age: "Age",
                gender: "Gender",
                occupation: "Occupation",
                financial: "Financial & Regional",
                incomeBand: "Income Band",
                state: "State",
                district: "District",
                docs: "Document Checklist",
                submit: "FIND MATCHING SCHEMES",
                analyzing: "ANALYZING ELIGIBILITY...",
                saveDraft: "SAVE AS DRAFT (OFFLINE)",
                draftSaved: "DRAFT SAVED LOCALLY"
            },
            readiness: {
                title: "Application Readiness",
                strength: "Verification Strength",
                desc: "Based on your documents, you can instantly verify for a percentage of schemes."
            }
        },
        dashboard: {
            title: "Citizen Dashboard",
            subtitle: "Manage your digital identity and track your welfare benefits.",
            tabs: {
                identity: "IDENTITY",
                intelligence: "INTELLIGENCE FEED",
                tracker: "TRACKER",
                beneficiaries: "BENEFICIARIES",
                vault: "VERIFIED VAULT"
            },
            addBeneficiary: "Add Family Member",
            saveBeneficiary: "SAVE BENEFICIARY",
            noSchemes: "No schemes tracked yet",
            noSchemesDesc: "Head to the schemes explorer to shortlist programs.",
            benName: "Full Name",
            benRelation: "Relation",
            benAge: "Age",
            savedSuccess: "SAVED SUCCESSFULLY",
            loading: "Loading Dashboard...",
            intelligence: {
                title: "Intelligence Feed",
                liveUpdates: "Live Updates",
                noUpdates: "No matching updates yet"
            }
        },
        profileForm: {
            title: "Your Profile",
            desc: "Complete your profile to get personalized scheme recommendations.",
            education: "Education Level",
            incomeFamily: "Annual Family Income (₹)",
            category: "Category / Caste",
            occupationTags: "Occupation / Tags (comma separated)",
            saveAndFind: "Save & Find Schemes",
            saving: "Saving..."
        },
        volunteer: {
            title: "Volunteer Portal",
            subtitle: "Authorized Personnel Access Only",
            empId: "Employee ID / Full Name",
            idVerification: "IDENTITY VERIFICATION",
            activeBen: "Active Beneficiaries",
            offlineDrafts: "Offline Drafts",
            successRate: "Token Success Rate",
            impactScore: "Impact Score",
            assignedTitle: "Assigned Beneficiaries",
            assignedDesc: "Manage and assist citizens with scheme documentation.",
            findCitizen: "FIND CITIZEN",
            newRegistration: "NEW REGISTRATION",
            syncCloud: "SYNC ALL TO CLOUD",
            noProfiles: "No active profiles assigned",
            registerStart: "Start by registering a citizen at the last mile."
        },
        verifier: {
            title: "Privacy-First Verification",
            description: "Your document is scanned locally in your browser. No image data is sent to our servers.",
            select: "Select Income Certificate / ID",
            processing: "Initializing Secure Worker...",
            verifying: "Verifying Eligibility...",
            success: "Verification Successful!",
            failure: "Verification failed.",
            aadhaar: "Detected Aadhaar: XXXX-XXXX-",
            tryAgain: "Try Again",
            supports: "Supports JPG, PNG, and PDF documents (Verified locally)."
        },
        schemeCard: {
            bestMatch: "Best Match",
            eligible: "ELIGIBLE",
            highPriority: "HIGH PRIORITY",
            save: "SAVE",
            saved: "SAVED",
            apply: "APPLY JOIN",
            applied: "APPLIED",
            coreBenefit: "Core Benefit",
            requiredProofs: "Required Proofs",
            compare: "Compare",
            selected: "Selected",
            whyMatches: "Why it matches"
        },
        common: {
            importantNote: "Important Note",
            preliminaryCheck: "This is a preliminary check. Final approval happens at the government office.",
            noResults: "No schemes found",
            noResultsDesc: "Try broadening your criteria or checking for general schemes in the repository.",
            browseAll: "BROWSE ALL SCHEMES",
            modifyProfile: "MODIFY PROFILE",
            nearestCenter: "FIND NEAREST CENTER",
            privacyActive: "DATA PRIVACY ACTIVE"
        },
        sidebar: {
            adminPortal: "Administrative Portal",
            volunteerWorkspace: "Volunteer Workspace",
            overview: "Overview",
            impactMap: "Impact Map",
            schemes: "Schemes",
            analytics: "Analytics",
            citizens: "Citizens",
            settings: "Settings",
            dashboard: "Dashboard",
            beneficiaries: "Beneficiaries",
            checkEligibility: "Check Eligibility",
            resources: "Resources",
            mySchemes: "My Schemes",
            myProfile: "My Profile",
            signOut: "Sign Out"
        },
        explorer: {
            title: "Welfare Geography",
            engine: "Regional Discovery Engine",
            optimizing: "Optimizing Map Experience...",
            resetHint: "Click outside or state again to reset",
            exploreHint: "Click a state to explore local welfare programs",
            regionalSchemes: "Regional Schemes",
            readyToApply: "Ready to Apply",
            noSchemesTitle: "No state-specific schemes matching our current repository.",
            noSchemesDesc: "We're constantly expanding our database. Check back soon!",
            impact: "Regional Impact",
            citizensAssisted: "Citizens assisted in {state} this month.",
            viewFullReport: "VIEW FULL REPORT",
            details: "DETAILS"
        }
    },
    hi: {
        nav: {
            schemes: "योजनाएं",
            volunteer: "स्वयंसेवक",
            admin: "एडमिन",
            profile: "प्रोफ़ाइल",
            logout: "लॉगआउट",
            login: "लॉगइन",
            getStarted: "शुरू करें",
            resources: "संसाधन"
        },
        admin: {
            title: "शासन इंटेलिजेंस",
            subtitle: "वास्तविक समय सगाई मेट्रिक्स और योजना फ़नल विश्लेषण।",
            seedRepo: "रिपॉजिटरी सीड करें",
            exportReport: "रिपोर्ट निर्यात करें",
            totalAssessed: "कुल मूल्यांकन",
            matchesFound: "मैच मिले",
            activeFunnel: "सक्रिय फ़नल",
            docReadiness: "दस्तावेज़ तत्परता",
            regionalBridge: "क्षेत्रीय कल्याण सेतु",
            bridgeDesc: "योजना रुचि और लाभ वितरण के बीच रूपांतरण अंतराल का विश्लेषण।",
            engagementFunnel: "सगाई फ़नल",
            livePerformance: "लाइव प्रदर्शन",
            funnelDesc: "खोज से लाभ प्राप्ति तक उपयोगकर्ता की यात्रा।",
            dropOffAnalysis: "ड्रॉप-ऑफ विश्लेषण",
            dropOffDesc: "अपात्रता के प्राथमिक कारण।",
            actionRecommended: "सिफारिश की गई कार्रवाई:",
            incomeLimitNotice: "आय सीमा के कारण उच्च ड्रॉप-ऑफ मध्यम आय विशिष्ट कार्यक्रमों की आवश्यकता का सुझाव देता है।",
            directory: {
                title: "नागरिक निर्देशिका",
                desc: "पंजीकृत नागरिक प्रोफाइल और उनकी पात्रता स्थिति का प्रबंधन और निगरानी करें।",
                search: "नागरिक खोजें...",
                filter: "फ़िल्टर",
                loading: "डेटाबेस लोड हो रहा है...",
                thCitizen: "नागरिक",
                thDemographics: "जनसांख्यिकी",
                thStatus: "स्थिति",
                thActivity: "हाल की गतिविधि",
                verified: "सत्यापित",
                pending: "लंबित",
                anonymous: "अनाम उपयोगकर्ता",
                noEmail: "कोई ईमेल प्रदान नहीं किया गया",
                noActivity: "कोई जांच इतिहास नहीं",
                noResults: "कोई नागरिक नहीं मिला"
            },
            analytics: {
                title: "एनालिटिक्स हబ్",
                desc: "जनसांख्यिकीय रुझानों, योजना अपनाने और क्षेत्रीय प्रदर्शन में गहराई से उतरें।",
                last30Days: "पिछले 30 दिन",
                exportReport: "रिपोर्ट निर्यात करें",
                volumeTrends: "वॉल्यूम रुझान",
                volumeDesc: "मासिक आवेदन बनाम सत्यापन वृद्धि।",
                ageDemographics: "आयु जनसांख्यिकी",
                ageDesc: "आयु समूहों द्वारा जनसंख्या वितरण।",
                incomeBreakdown: "आय विवरण",
                incomeDesc: "आर्थिक क्षेत्रों में वितरण।",
                applications: "आवेदन",
                verifiedStat: "सत्यापित"
            }
        },
        hero: {
            badge: "आधिकारिक डिजिटल कल्याण पोर्टल",
            title: "कल्याणकारी पहुंच।",
            subtitle: "पूर्ण गोपनीयता।",
            description: "पूरी तरह से अपने ब्राउज़र में केंद्र और राज्य की योजनाओं के लिए अपनी पात्रता खोजें और सत्यापित करें। हमारे सर्वर पर कोई डेटा नहीं रहता है।",
            cta: "मेरी पात्रता जांचें",
            explore: "सभी योजनाओं का पता लगाएं"
        },
        roles: {
            citizen: {
                title: "राज्य के नागरिक",
                desc: "स्थानीय स्तर पर पात्रता सत्यापित करें। हम आपकी पहचान का एक भी बाइट संग्रहीत किए बिना आपके दस्तावेज़ों को स्कैन करते हैं।",
                cta: "सत्यापन शुरू करें"
            },
            volunteer: {
                title: "क्षेत्र स्वयंसेवक",
                desc: "सरकारी सेवाओं की अंतिम मील वितरण सक्षम करें। स्थानीय प्रसंस्करण के साथ दूरदराज के क्षेत्रों में परिवारों का समर्थन करें।",
                cta: "पोर्टल खोलें"
            },
            admin: {
                title: "शासन इंटेलिजेंस",
                desc: "वास्तविक समय सगाई मेट्रिक्स और योजना फ़नल विश्लेषण।",
                cta: "पोर्टल खोलें"
            }
        },
        trust: {
            title: "आर्किटेक्चर द्वारा सुरक्षा।",
            subtitle: "हमने सिटिजनडेस्क को यह सुनिश्चित करने के लिए बनाया है कि दुनिया का सबसे संवेदनशील डेटा — आपके दस्तावेज़ — आपके हाथों से कभी बाहर न जाएं।",
            items: {
                ocr: { title: "स्थानीय-ओनली OCR", desc: "दस्तावेज़ स्कैनिंग वेबवर्कर्स का उपयोग करके 100% आपके डिवाइस पर होती है।" },
                logs: { title: "शून्य सेशन लॉग", desc: "हम आपके दस्तावेज़, चेहरा या आईडी नंबर लॉग नहीं करते हैं। एक सेकंड के लिए भी नहीं।" },
                tokens: { title: "तत्काल टोकन", desc: "एक बार सत्यापित होने के बाद, आपको एजेंसियों के लिए पात्रता साबित करने के लिए एक एन्क्रिप्टेड टोकन मिलता है।" },
                public: { title: "जनता का विश्वास", desc: "जटिल नीतियों और उन लोगों के बीच की खाई को पाटने के लिए बनाया गया है जिनकी वे सेवा करते हैं।" }
            }
        },
        schemes: {
            title: "कल्याण एक्सप्लोरर",
            subtitle: "सत्यापित पात्रता टोकन के साथ केंद्रीय और राज्य कार्यक्रमों तक पहुंचें।",
            recommended: "आपके लिए अनुशंसित",
            all: "सभी योजनाओं की खोज करें",
            personalize: "परिणामों को निजीकृत करें",
            searchPlaceholder: "कीवर्ड द्वारा खोजें...",
            loading: "योजनाएं प्राप्त की जा रही हैं..."
        },
        check: {
            title: "पात्रता जांचकर्ता",
            prediction: {
                title: "भविष्य कहनेवाला खुफिया",
                subtitle: "पात्रता पूर्वानुमान",
                badge: "लाइव एआई डेटा",
                ageTitle: "आयु मील के पत्थर",
                incomeTitle: "आय संरेखण",
                docTitle: "दस्तावेज़ तत्परता",
                confidence: "विश्वास पथ",
                timeToTarget: "लक्ष्य तक का समय"
            },
            profile: "व्यक्तिगत प्रोफ़ाइल",
            profileDesc: "सटीक विवरण हमें सर्वोत्तम कल्याणकारी कार्यक्रम खोजने में मदद करते हैं।",
            matches: "व्यक्तिगत मैच",
            matchesDesc: "हमें आपकी प्रोफ़ाइल के लिए {count} कार्यक्रम मिले।",
            form: {
                demographics: "जनसांख्यिकी",
                name: "पूरा नाम",
                age: "आयु",
                gender: "लिंग",
                occupation: "व्यवसाय",
                financial: "वित्तीय और क्षेत्रीय",
                incomeBand: "आय वर्ग",
                state: "राज्य",
                district: "जिला",
                docs: "दस्तावेज़ चेकलिस्ट",
                submit: "मिलान योजनाएं खोजें",
                analyzing: "पात्रता का विश्लेषण...",
                saveDraft: "ड्राफ्ट के रूप में सहेजें (ऑफ़लाइन)",
                draftSaved: "ड्राफ्ट स्थानीय रूप से सहेजा गया"
            },
            readiness: {
                title: "आवेदन की तैयारी",
                strength: "सत्यापन शक्ति",
                desc: "आपके दस्तावेज़ों के आधार पर, आप योजनाओं के प्रतिशत के लिए तुरंत सत्यापित कर सकते हैं।"
            }
        },
        dashboard: {
            title: "सिटिजन डैशबोर्ड",
            subtitle: "अपनी डिजिटल पहचान प्रबंधित करें और अपने कल्याणकारी लाभों को ट्रैक करें।",
            tabs: {
                identity: "पहचान",
                intelligence: "इंटेलिजेंस फीड",
                tracker: "ट्रैकर",
                beneficiaries: "लाभार्थी",
                vault: "सत्यापित वॉल्ट"
            },
            addBeneficiary: "परिवार के सदस्य को जोड़ें",
            saveBeneficiary: "लाभार्थी को सुरक्षित करें",
            noSchemes: "अभी तक कोई योजना ट्रैक नहीं की गई",
            noSchemesDesc: "कार्यक्रमों को शॉर्टलिस्ट करने के लिए स्कीम्स एक्सप्लोरर पर जाएं।",
            benName: "पूरा नाम",
            benRelation: "संबंध",
            benAge: "आयु",
            savedSuccess: "सफलतापूर्वक सहेजा गया",
            loading: "डैशबोर्ड लोड हो रहा है...",
            intelligence: {
                title: "इंटेलिजेंस फीड",
                liveUpdates: "लाइव अपडेट",
                noUpdates: "अभी तक कोई मिलान अपडेट नहीं है"
            }
        },
        profileForm: {
            title: "आपकी प्रोफ़ाइल",
            desc: "व्यक्तिगत योजना सिफारिशें प्राप्त करने के लिए अपनी प्रोफ़ाइल पूरी करें।",
            education: "शिक्षा का स्तर",
            incomeFamily: "वार्षिक पारिवारिक आय (₹)",
            category: "श्रेणी / जाति",
            occupationTags: "व्यवसाय / टैग (कोमा से अलग)",
            saveAndFind: "सहेजें और योजनाएं खोजें",
            saving: "सहेजा जा रहा है..."
        },
        volunteer: {
            title: "स्वयंसेवक पोर्टल",
            subtitle: "केवल अधिकृत कर्मियों के लिए पहुंच",
            empId: "कर्मचारी आईडी / पूरा नाम",
            idVerification: "पहचान सत्यापन",
            activeBen: "सक्रिय लाभार्थी",
            offlineDrafts: "ऑफ़लाइन ड्राफ्ट",
            successRate: "टोकन सफलता दर",
            impactScore: "प्रभाव स्कोर",
            assignedTitle: "सौंपे गए लाभार्थी",
            assignedDesc: "योजना दस्तावेजों के साथ नागरिकों की प्रबंधन और सहायता करें।",
            findCitizen: "नागरिक खोजें",
            newRegistration: "नया पंजीकरण",
            syncCloud: "क्लाउड पर सिंक करें",
            noProfiles: "कोई सक्रिय प्रोफ़ाइल नहीं मिली",
            registerStart: "अंतिम मील पर नागरिक को पंजीकृत करके शुरू करें।"
        },
        verifier: {
            title: "गोपनीयता-प्रथम सत्यापन",
            description: "आपका दस्तावेज़ स्थानीय रूप से आपके ब्राउज़र में स्कैन किया जाता है। हमारे सर्वर पर कोई इमेज डेटा नहीं भेजा जाता है।",
            select: "आय प्रमाण पत्र / आईडी चुनें",
            processing: "सुरक्षित वर्कर प्रारंभ हो रहा है...",
            verifying: "पात्रता का विश्लेषण...",
            success: "सत्यापन सफल!",
            failure: "सत्यापन विफल रहा।",
            aadhaar: "पता चला आधार: XXXX-XXXX-",
            tryAgain: "फिर से प्रयास करें",
            supports: "JPG, PNG और PDF दस्तावेज़ों का समर्थन करता है (स्थानीय रूप से सत्यापित)।"
        },
        schemeCard: {
            bestMatch: "सर्वोत्तम मिलान",
            eligible: "पात्र",
            highPriority: "उच्च प्राथमिकता",
            save: "सहेजें",
            saved: "सहेजा गया",
            apply: "आवेदन करें",
            applied: "आवेदन किया गया",
            coreBenefit: "मुख्य लाभ",
            requiredProofs: "आवश्यक प्रमाण",
            compare: "तुलना करें",
            selected: "चयनित",
            whyMatches: "यह क्यों मेल खाता है"
        },
        common: {
            importantNote: "महत्वपूर्ण नोट",
            preliminaryCheck: "यह एक प्रारंभिक जांच है। अंतिम अनुमोदन सरकारी कार्यालय में होता है।",
            noResults: "कोई योजना नहीं मिली",
            noResultsDesc: "अपनी मानदंड बढ़ाएं या रिपॉजिटरी में सामान्य योजनाओं की जांच करें।",
            browseAll: "सभी योजनाएं देखें",
            modifyProfile: "प्रोफ़ाइल बदलें",
            nearestCenter: "निकटतम केंद्र खोजें",
            privacyActive: "डेटा गोपनीयता सक्रिय"
        },
        sidebar: {
            adminPortal: "प्रशासनिक पोर्टल",
            volunteerWorkspace: "स्वयंसेवक कार्यक्षेत्र",
            overview: "अवलोकन",
            impactMap: "प्रभाव मानचित्र",
            schemes: "योजनाएं",
            analytics: "विश्लेषण",
            citizens: "नागरिक",
            settings: "सेटिंग्स",
            dashboard: "डैशबोर्ड",
            beneficiaries: "लाभार्थी",
            checkEligibility: "पात्रता जांचें",
            resources: "संसाधन",
            mySchemes: "मेरी योजनाएं",
            myProfile: "मेरी प्रोफ़ाइल",
            signOut: "साइन आउट"
        },
        explorer: {
            title: "कल्याण भूगोल",
            engine: "क्षेत्रीय खोज इंजन",
            optimizing: "मानचित्र अनुभव को अनुकूलित किया जा रहा है...",
            resetHint: "रीसेट करने के लिए बाहर या राज्य पर फिर से क्लिक करें",
            exploreHint: "स्थानीय कल्याण कार्यक्रमों का पता लगाने के लिए राज्य पर क्लिक करें",
            regionalSchemes: "क्षेत्रीय योजनाएं",
            readyToApply: "आवेदन के लिए तैयार",
            noSchemesTitle: "हमारे वर्तमान भंडार से मेल खाने वाली कोई राज्य-विशिष्ट योजना नहीं है।",
            noSchemesDesc: "हम लगातार अपने डेटाबेस का विस्तार कर रहे हैं। जल्द ही वापस जांचें!",
            impact: "क्षेत्रीय प्रभाव",
            citizensAssisted: "इस महीने {state} में नागरिकों की सहायता की गई।",
            viewFullReport: "पूरी रिपोर्ट देखें",
            details: "विवरण"
        }
    },
    te: {
        nav: {
            schemes: "పథకాలు",
            volunteer: "వాలంటీర్",
            admin: "అడ్మిన్",
            profile: "ప్రొఫైల్",
            logout: "లాగ్ అవుట్",
            login: "లాగిన్",
            getStarted: "ప్రారంభించండి",
            resources: "వనరులు"
        },
        admin: {
            title: "పాలన ఇంటెలిజెన్స్",
            subtitle: "రియల్ టైమ్ ఎంగేజేమెంట్ మెట్రిక్స్ మరియు స్కీమ్ ఫన్నెల్ అనలిసిస్.",
            seedRepo: "రిపోజిటరీని సీడ్ చేయండి",
            exportReport: "నివేదికను ఎగుమతి చేయండి",
            totalAssessed: "మొత్తం అంచనా వేయబడింది",
            matchesFound: "మ్యాచ్‌లు కనుగొనబడ్డాయి",
            activeFunnel: "యాక్టివ్ ఫన్నెల్",
            docReadiness: "డాక్యుమెంట్ సంసిద్ధత",
            regionalBridge: "ప్రాంతీయ సంక్షేమ వంతెన",
            bridgeDesc: "పథకం ఆసక్తి మరియు ప్రయోజన డెలివరీ మధ్య మార్పిడి అంతరాన్ని విశ్లేషించడం.",
            engagementFunnel: "ఎంగేజేమెంట్ ఫన్నెల్",
            livePerformance: "ప్రత్యక్ష ప్రదర్శన",
            funnelDesc: "కనుగొనడం నుండి ప్రయోజనం పొందే వరకు వినియోగదారు ప్రయాణం.",
            dropOffAnalysis: "డ్రాప్-ఆఫ్ విశ్లేషణ",
            dropOffDesc: "అనర్హతకు ప్రాథమిక కారణాలు.",
            actionRecommended: "సిఫార్సు చేయబడిన చర్య:",
            incomeLimitNotice: "ఆదాయ పరిమితుల వల్ల అధిక డ్రాప్-ఆఫ్ మధ్యతరగతి ఆదాయ నిర్దిష్ట కార్యక్రమాల అవసరాన్ని సూచిస్తుంది.",
            directory: {
                title: "పౌర డైరెక్టరీ",
                desc: "నమోదిత పౌర ప్రొఫైల్‌లు మరియు వారి అర్హత స్థితిని నిర్వహించండి మరియు పర్యవేక్షించండి.",
                search: "పౌరుల కోసం వెతకండి...",
                filter: "ఫిల్టర్",
                loading: "డేటాబేస్ లోడ్ అవుతోంది...",
                thCitizen: "పౌరుడు",
                thDemographics: "జనాభా వివరాలు",
                thStatus: "స్థితి",
                thActivity: "ఇటీవలి కార్యాచరణ",
                verified: "ధృవీకరించబడింది",
                pending: "పెండింగ్‌లో ఉంది",
                anonymous: "అజ్ఞాత వినియోగదారు",
                noEmail: "ఈమెయిల్ అందించబడలేదు",
                noActivity: "ఎటువంటి తనిఖీ చరిత్ర లేదు",
                noResults: "పౌరులు ఎవరూ కనుగొనబడలేదు"
            },
            analytics: {
                title: "అనలిటిక్స్ హబ్",
                desc: "జనాభా ధోరణులు, పథకం స్వీకరణ మరియు ప్రాంతీయ పనితీరుపై లోతైన అధ్యయనం.",
                last30Days: "గత 30 రోజులు",
                exportReport: "నివేదికను ఎగుమతి చేయండి",
                volumeTrends: "వాల్యూమ్ ధోరణులు",
                volumeDesc: "నెలవారీ దరఖాస్తు వర్సెస్ ధృవీకరణ వృద్ధి.",
                ageDemographics: "వయస్సు జనాభా",
                ageDesc: "వయస్సు సమూహాల వారీగా జనాభా పంపిణీ.",
                incomeBreakdown: "ఆదాయ విభజన",
                incomeDesc: "ఆర్థిక విభాగాల అంతటా పంపిణీ.",
                applications: "దరఖాస్తులు",
                verifiedStat: "ధృవీకరించబడింది"
            }
        },
        hero: {
            badge: "అధికారిక డిజిటల్ సంక్షేమ పోర్టల్",
            title: "సంక్షేమ ప్రాప్తి.",
            subtitle: "పూర్తి గోప్యత.",
            description: "పూర్తిగా మీ బ్రౌజర్‌లోనే కేంద్ర మరియు రాష్ట్ర పథకాలకు మీ అర్హతను కనుగొనండి మరియు ధృవీకరించండి. మా సర్వర్‌లలో ఎటువంటి డేటా ఉండదు.",
            cta: "నా అర్హతను తనిఖీ చేయండి",
            explore: "అన్ని పథకాలను అన్వేషించండి"
        },
        roles: {
            citizen: {
                title: "రాష్ట్ర పౌరులు",
                desc: "లోకల్ గా అర్హతను ధృవీకరించండి. మీ గుర్తింపును నిల్వ చేయకుండా మేము మీ పత్రాలను స్కాన్ చేస్తాము.",
                cta: "ధృవీకరణ ప్రారంభించండి"
            },
            volunteer: {
                title: "ఫీల్డ్ వాలంటీర్లు",
                desc: "ప్రభుత్వ సేవల చివరి మైలు పంపిణీని ప్రారంభించండి. లోకల్ ప్రాసెసింగ్‌తో మారుమూల ప్రాంతాల్లోని కుటుంబాలకు మద్దతు ఇవ్వండి.",
                cta: "పోర్టల్ తెరవండి"
            },
            admin: {
                title: "పాలన ఇంటెలిజెన్స్",
                desc: "రియల్ టైమ్ ఎంగేజేమెంట్ మెట్రిక్స్ మరియు స్కీమ్ ఫన్నెల్ అనలిసిస్.",
                cta: "పోర్టల్ తెరవండి"
            }
        },
        trust: {
            title: "ఆర్కిటెక్చర్ ద్వారా భద్రత.",
            subtitle: "ప్రపంచంలోని అత్యంత సున్నితమైన డేటా — మీ పత్రాలు — మీ చేతుల్లోనే ఉండేలా మేము సిటిజన్ డెస్క్‌ను రూపొందించాము.",
            items: {
                ocr: { title: "లోకల్-మాత్రమే OCR", desc: "వెబ్ వర్కర్లను ఉపయోగించి డాక్యుమెంట్ స్కానింగ్ 100% మీ పరికరంలోనే జరుగుతుంది." },
                logs: { title: "జీరో సెషన్ లాగ్", desc: "మేము మీ ఫైల్‌లు, ముఖం లేదా ఐడి నంబర్‌లను లాగ్ చేయము. ఒక్క సెకను కూడా." },
                tokens: { title: "తక్షణ టోకెన్లు", desc: "ధృవీకరించబడిన తర్వాత, ఏజెన్సీలకు అర్హతను నిరూపించడానికి మీకు ఎన్క్రిప్టెడ్ టోకెన్ లభిస్తుంది." },
                public: { title: "ప్రజా విశ్వాసం", desc: "క్లిష్టమైన విధానాలు మరియు అవి సేవ చేసే వ్యక్తుల మధ్య అంతరాన్ని తగ్గించడానికి నిర్మించబడింది." }
            }
        },
        schemes: {
            title: "సంక్షేమ ఎక్స్ప్లోరర్",
            subtitle: "ధృవీకరించబడిన అర్హత టోకెన్‌లతో కేంద్ర మరియు రాష్ట్ర కార్యక్రమాలను యాక్సెస్ చేయండి.",
            recommended: "మీ కోసం సిఫార్సు చేయబడినవి",
            all: "అన్ని పథకాలను కనుగొనండి",
            personalize: "ఫలితాలను వ్యక్తిగతీకరించండి",
            searchPlaceholder: "కీవర్డ్ల ద్వారా వెతకండి...",
            loading: "పథకాలను సేకరిస్తోంది..."
        },
        check: {
            title: "అర్హత తనిఖీ",
            prediction: {
                title: "ప్రిడిక్టివ్ ఇంటెలిజెన్స్",
                subtitle: "అర్హత అంచనా",
                badge: "లైవ్ AI డేటా",
                ageTitle: "వయస్సు మైలురాళ్లు",
                incomeTitle: "ఆదాయ సమలేఖనం",
                docTitle: "డాక్యుమెంట్ సంసిద్ధత",
                confidence: "విశ్వాస మార్గం",
                timeToTarget: "లక్ష్యానికి సమయం"
            },
            profile: "వ్యక్తిగత ప్రొఫైల్",
            profileDesc: "ఖచ్చితమైన వివరాలు ఉత్తమ సంక్షేమ కార్యక్రమాలను కనుగొనడంలో మాకు సహాయపడతాయి.",
            matches: "వ్యక్తిగతీకరించిన మ్యాచ్‌లు",
            matchesDesc: "మేము మీ ప్రొఫైల్ కోసం {count} ప్రోగ్రామ్‌లను కనుగొన్నాము.",
            form: {
                demographics: "డెమోగ్రాఫిక్స్",
                name: "పూర్తి పేరు",
                age: "వయస్సు",
                gender: "లింగం",
                occupation: "వృత్తి",
                financial: "ఆర్థిక మరియు ప్రాంతీయ",
                incomeBand: "ఆదాయ బ్యాండ్",
                state: "రాష్ట్రం",
                district: "జిల్లా",
                docs: "డాక్యుమెంట్ చెక్లిస్ట్",
                submit: "సరిపోయే పథకాలను కనుగొనండి",
                analyzing: "అర్హతను విశ్లేషిస్తోంది...",
                saveDraft: "డ్రాఫ్ట్‌గా సేవ్ చేయండి (ఆఫ్‌లైన్)",
                draftSaved: "డ్రాఫ్ట్ లోకల్ గా సేవ్ చేయబడింది"
            },
            readiness: {
                title: "అప్లికేషన్ సంసిద్ధత",
                strength: "ధృవీకరణ బలం",
                desc: "మీ పత్రాల ఆధారంగా, మీరు పథకాల శాతం కోసం తక్షణమే ధృవీకరించవచ్చు."
            }
        },
        dashboard: {
            title: "సిటిజన్ డాష్‌బోర్డ్",
            subtitle: "మీ డిజిటల్ గుర్తింపును నిర్వహించండి మరియు మీ సంక్షేమ ప్రయోజనాలను ట్రాక్ చేయండి.",
            tabs: {
                identity: "గుర్తింపు",
                intelligence: "ఇంటెలిజెన్స్ ఫీడ్",
                tracker: "ట్రాకర్",
                beneficiaries: "లబ్ధిదారులు",
                vault: "ధృవీకరించబడిన వాల్ట్"
            },
            addBeneficiary: "కుటుంబ సభ్యుడిని జోడించండి",
            saveBeneficiary: "లబ్ధిదారుడిని సేవ్ చేయండి",
            noSchemes: "ఇంకా ఎటువంటి పథకాలు ట్రాక్ చేయబడలేదు",
            noSchemesDesc: "కార్యక్రమాలను షార్ట్‌లిస్ట్ చేయడానికి పథకాల ఎక్స్‌ప్లోరర్‌కు వెళ్లండి.",
            benName: "పూర్తి పేరు",
            benRelation: "సంబంధం",
            benAge: "వయస్సు",
            savedSuccess: "విజయవంతంగా సేవ్ చేయబడింది",
            loading: "డాష్‌బోర్డ్ లోడ్ అవుతోంది...",
            intelligence: {
                title: "ఇంటెలిజెన్స్ ఫీడ్",
                liveUpdates: "లైవ్ అప్‌డేట్‌లు",
                noUpdates: "ఇంకా ఎటువంటి అప్‌డేట్‌లు లేవు"
            }
        },
        profileForm: {
            title: "మీ ప్రొఫైల్",
            desc: "వ్యక్తిగతీకరించిన పథక సిఫార్సులను పొందడానికి మీ ప్రొఫైల్‌ను పూర్తి చేయండి.",
            education: "విద్యార్హత",
            incomeFamily: "వార్షిక కుటుంబ ఆదాయం (₹)",
            category: "వర్గం / కులం",
            occupationTags: "వృత్తి / ట్యాగ్‌లు (కామాలతో వేరు చేయండి)",
            saveAndFind: "సేవ్ చేయండి & పథకాలను కనుగొనండి",
            saving: "సేవ్ అవుతోంది..."
        },
        volunteer: {
            title: "వాలంటీర్ పోర్టల్",
            subtitle: "అధీకృత సిబ్బందికి మాత్రమే ప్రవేశం",
            empId: "ఎంప్లాయీ ఐడి / పూర్తి పేరు",
            idVerification: "గుర్తింపు ధృవీకరణ",
            activeBen: "యాక్టివ్ లబ్ధిదారులు",
            offlineDrafts: "ఆఫ్‌లైన్ డ్రాఫ్ట్‌లు",
            successRate: "టోకెన్ విజయ రేటు",
            impactScore: "ప్రభావ స్కోరు",
            assignedTitle: "కేటాయించిన లబ్ధిదారులు",
            assignedDesc: "పథకం పత్రాలతో పౌరులకు సహాయం చేయండి మరియు నిర్వహించండి.",
            findCitizen: "పౌరుడిని కనుగొనండి",
            newRegistration: "కొత్త రిజిస్ట్రేషన్",
            syncCloud: "క్లౌడ్‌కు సింక్ చేయండి",
            noProfiles: "ఏ యాక్టివ్ ప్రొఫైల్‌లు లేవు",
            registerStart: "పౌరుడిని నమోదు చేయడం ద్వారా ప్రారంభించండి."
        },
        verifier: {
            title: "గోప్యత-మొదటి ధృవీకరణ",
            description: "మీ పత్రం మీ బ్రౌజర్‌లో లోకల్ గా స్కాన్ చేయబడుతుంది. మా సర్వర్‌లకు ఎటువంటి ఇమేజ్ డేటా పంపబడదు.",
            select: "ఆదాయ ధృవీకరణ పత్రం / ఐడిని ఎంచుకోండి",
            processing: "సురక్షిత వర్కర్ ప్రారంభించబడుతోంది...",
            verifying: "అర్హతను ధృవీకరిస్తోంది...",
            success: "ధృవీకరణ విజయవంతమైంది!",
            failure: "ధృవీకరణ విఫలమైంది.",
            aadhaar: "గుర్తించిన ఆధార్: XXXX-XXXX-",
            tryAgain: "మళ్ళీ ప్రయత్నించండి",
            supports: "JPG, PNG మరియు PDF పత్రాలకు మద్దతు ఇస్తుంది (స్థానికంగా ధృవీకరించబడింది)."
        },
        schemeCard: {
            bestMatch: "ఉత్తమ మ్యాచ్",
            eligible: "అర్హులు",
            highPriority: "అధిక ప్రాధాన్యత",
            save: "సేవ్ చేయి",
            saved: "సేవ్ చేయబడింది",
            apply: "దరఖాస్తు చేయి",
            applied: "దరఖాస్తు చేయబడింది",
            coreBenefit: "ప్రధాన ప్రయోజనం",
            requiredProofs: "అవసరమైన ఆధారాలు",
            compare: "పోల్చండి",
            selected: "ఎంపిక చేయబడింది",
            whyMatches: "ఇది ఎందుకు సరిపోతుంది"
        },
        common: {
            importantNote: "ముఖ్య గమనిక",
            preliminaryCheck: "ఇది ప్రాథమిక తనిఖీ మాత్రమే. తుది ఆమోదం ప్రభుత్వ కార్యాలయంలో జరుగుతుంది.",
            noResults: "ఎటువంటి పథకాలు కనుగొనబడలేదు",
            noResultsDesc: "మీ ప్రమాణాలను విస్తరించండి లేదా రిపోజిటరీలో సాధారణ పథకాల కోసం తనిఖీ చేయండి.",
            browseAll: "అన్ని పథకాలను చూడండి",
            modifyProfile: "ప్రొఫైల్‌ను మార్చండి",
            nearestCenter: "సమీప కేంద్రాన్ని కనుగొనండి",
            privacyActive: "డేటా గోప్యత యాక్టివ్"
        },
        sidebar: {
            adminPortal: "పరిపాలనా పోర్టల్",
            volunteerWorkspace: "వాలంటీర్ వర్క్‌స్పేస్",
            overview: "అవలోకనం",
            impactMap: "ప్రభావ మ్యాప్",
            schemes: "పథకాలు",
            analytics: "అనలిటిక్స్",
            citizens: "పౌరులు",
            settings: "సెట్టింగులు",
            dashboard: "డాష్‌బోర్డ్",
            beneficiaries: "లబ్ధిదారులు",
            checkEligibility: "అర్హతను తనిఖీ చేయండి",
            resources: "వనరులు",
            mySchemes: "నా పథకాలు",
            myProfile: "నా ప్రొఫైల్",
            signOut: "సైన్ అవుట్"
        },
        explorer: {
            title: "సంక్షేమ భౌగోళికం",
            engine: "ప్రాంతీయ ఆవిష్కరణ ఇంజిన్",
            optimizing: "మ్యాప్ అనుభవాన్ని ఆప్టిమైజ్ చేస్తోంది...",
            resetHint: "రీసెట్ చేయడానికి వెలుపల లేదా స్టేట్ పై మళ్ళీ క్లిక్ చేయండి",
            exploreHint: "స్థానిక సంక్షేమ కార్యక్రమాలను అన్వేషించడానికి ఒక రాష్ట్రాన్ని క్లిక్ చేయండి",
            regionalSchemes: "ప్రాంతీయ పథకాలు",
            readyToApply: "దరఖాస్తుకు సిద్ధంగా ఉంది",
            noSchemesTitle: "మా ప్రస్తుత రిపోజిటరీతో సరిపోలే రాష్ట్ర-నిర్దిష్ట పథకాలు లేవు.",
            noSchemesDesc: "మేము నిరంతరం మా డేటాబేస్ను విస్తరిస్తున్నాము. త్వరలో మళ్ళీ చూడండి!",
            impact: "ప్రాంతీయ ప్రభావం",
            citizensAssisted: "ఈ నెలలో {state}లో పౌరులకు సహాయం అందింది.",
            viewFullReport: "పూర్తి నివేదికను చూడండి",
            details: "వివరాలు"
        }
    }
};
