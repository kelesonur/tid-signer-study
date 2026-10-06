/* Hand-edited study texts and settings.
 * Items, pairs and practice trials are added by stimuli.js (build_stimuli.py).
 * Every text can be {tr: "...", en: "..."}; optional `video` fields take a
 * path to a TİD instruction video (strongly recommended for Deaf participants).
 * Lines marked [DOLDURUN] must be completed before the study starts.
 */
window.STUDY = {
  studyId: "tid-gen-eval-2026",
  version: "5e",  // 5e = Deaf: no Turkish writing (only question 1 before the Turkish sentence); 5d = expert: one rating screen per clip after the Turkish sentence, no reveal; 5c = expert scales 1-5 (same as Deaf), expert TİD self-rating; 5b = Deaf: Turkish writing + reveal + meaning questions; expert: lex scale + meaning step; 5 = expert: ours + gold-gloss avatar + real signer; Deaf link (?mode=deaf): avatar or real signer, 5 simple ratings; 4 = expert sequential 3-avatar (no real video); 3 = literacy + 4-condition expert; 2 = Rocketbox avatar
  // Google Apps Script web-app URL (see apps_script.gs). Leave "" for local-only mode.
  endpoint: "https://script.google.com/macros/s/AKfycbyw24WKaEa09QK1iVxX-_MFEccDk4N8gRV3l_FiejOktcyeypUg3XmqN0nmwLUbmKMX/exec",

  title: { tr: "TİD Çeviri Değerlendirmesi", en: "TİD Translation Evaluation" },
  welcome: {
    tr: "Bu çalışmada bilgisayarın Türkçeden TİD'e yaptığı çevirileri değerlendireceksiniz.",
    en: "In this study you will evaluate computer translations from Turkish into TİD.",
  },

  consent: {
    video: "",  // e.g. "media/instructions/consent_tid.mp4"
    text: {
      tr: "Bu çalışma Boğaziçi Üniversitesi Dilbilim Bölümü'nde yürütülen bir araştırmanın parçasıdır. Amacımız, bilgisayarın ürettiği Türk İşaret Dili (TİD) çevirilerinin ne kadar anlaşılır ve doğal olduğunu öğrenmektir.\n\n" +
          "Çalışma yaklaşık [DOLDURUN] dakika sürer. Sizden videoları izlemenizi, ne anladığınızı yazmanızı ve çevirileri puanlamanızı isteyeceğiz. Doğru ya da yanlış cevap yoktur; değerlendirilen siz değil, bilgisayar sistemidir.\n\n" +
          "Yanıtlarınız adınız olmadan, yalnızca bir katılımcı koduyla saklanır. Çalışmayı istediğiniz zaman bırakabilirsiniz. Etik kurul onayı: Boğaziçi Üniversitesi Beşeri Bilimler İnsan Araştırmaları Etik Kurulu (SBİNAREK), başvuru no 2025-78T, 17.11.2025 tarihli 2025/09 sayılı toplantı. Sorularınız için: onur.keles1@bogazici.edu.tr",
      en: "This study is part of research at the Department of Linguistics, Boğaziçi University. We want to learn how understandable and natural computer-generated Turkish Sign Language (TİD) translations are.\n\n" +
          "The study takes about [FILL IN] minutes. You will watch videos, write what you understood, and rate the translations. There are no right or wrong answers; we are testing the computer system, not you.\n\n" +
          "Your answers are stored without your name, only with a participant code. You can stop at any time. Ethics approval: Boğaziçi University Humanities Human Research Ethics Committee (SBİNAREK), application no. 2025-78T, meeting 2025/09 of 17.11.2025. Contact: onur.keles1@bogazici.edu.tr",
    },
  },

  background: [
    { id: "age", type: "radio", required: true, label: { tr: "Yaşınız", en: "Age" },
      options: ["18-29", "30-39", "40-49", "50-59", "60+"].map((v) => ({ value: v, label: v })) },
    { id: "hearing", type: "radio", required: true, label: { tr: "Kendinizi nasıl tanımlarsınız?", en: "How do you describe yourself?" },
      options: [
        { value: "deaf", label: { tr: "Sağır", en: "Deaf" } },
        { value: "hoh", label: { tr: "Az işiten", en: "Hard of hearing" } },
        { value: "coda", label: { tr: "İşiten, sağır ailede büyüdüm (CODA)", en: "Hearing, grew up in a Deaf family (CODA)" } },
        { value: "hearing", label: { tr: "İşiten", en: "Hearing" } },
      ] },
    { id: "tid_age", type: "radio", required: true, label: { tr: "TİD'i ne zaman öğrenmeye başladınız?", en: "When did you start learning TİD?" },
      options: [
        { value: "birth", label: { tr: "Doğuştan / ailemden", en: "From birth / from family" } },
        { value: "0-6", label: { tr: "Okul öncesi (0-6 yaş)", en: "Before school (age 0-6)" } },
        { value: "7-12", label: { tr: "İlkokulda (7-12 yaş)", en: "Primary school (age 7-12)" } },
        { value: "13+", label: { tr: "13 yaşından sonra", en: "After age 13" } },
      ] },
    { id: "deaf_family", type: "radio", required: true, label: { tr: "Ailenizde TİD kullanan sağır biri var mı?", en: "Is there a Deaf TİD user in your family?" },
      options: [
        { value: "parents", label: { tr: "Anne ve/veya baba", en: "Parent(s)" } },
        { value: "siblings", label: { tr: "Kardeş", en: "Sibling(s)" } },
        { value: "other", label: { tr: "Başka akraba", en: "Other relative" } },
        { value: "no", label: { tr: "Hayır", en: "No" } },
      ] },
    { id: "deaf_school", type: "radio", required: true, label: { tr: "Sağırlar okuluna gittiniz mi?", en: "Did you attend a school for the Deaf?" },
      options: [
        { value: "boarding", label: { tr: "Evet, yatılı", en: "Yes, boarding" } },
        { value: "day", label: { tr: "Evet, gündüzlü", en: "Yes, day school" } },
        { value: "no", label: { tr: "Hayır", en: "No" } },
      ] },
    { id: "daily_use", type: "radio", required: true, label: { tr: "TİD'i ne sıklıkla kullanıyorsunuz?", en: "How often do you use TİD?" },
      options: [
        { value: "daily", label: { tr: "Her gün", en: "Every day" } },
        { value: "weekly", label: { tr: "Haftada birkaç kez", en: "A few times a week" } },
        { value: "less", label: { tr: "Daha az", en: "Less often" } },
      ] },
    { id: "interpreter", type: "radio", required: true, label: { tr: "TİD tercümanı olarak çalışıyor musunuz?", en: "Do you work as a TİD interpreter?" },
      options: [{ value: "yes", label: { tr: "Evet", en: "Yes" } }, { value: "no", label: { tr: "Hayır", en: "No" } }] },
    // 29 Sep 2026: participants write what they understood in Turkish, so Turkish literacy is asked
    { id: "tr_read", type: "radio", required: true, label: { tr: "Türkçe okuma becerinizi nasıl değerlendirirsiniz?", en: "How do you rate your Turkish reading?" },
      options: [
        { value: "very_good", label: { tr: "Çok iyi", en: "Very good" } },
        { value: "good", label: { tr: "İyi", en: "Good" } },
        { value: "medium", label: { tr: "Orta", en: "Medium" } },
        { value: "weak", label: { tr: "Zayıf", en: "Weak" } },
      ] },
    { id: "tr_write", type: "radio", required: true, label: { tr: "Türkçe yazma becerinizi nasıl değerlendirirsiniz?", en: "How do you rate your Turkish writing?" },
      options: [
        { value: "very_good", label: { tr: "Çok iyi", en: "Very good" } },
        { value: "good", label: { tr: "İyi", en: "Good" } },
        { value: "medium", label: { tr: "Orta", en: "Medium" } },
        { value: "weak", label: { tr: "Zayıf", en: "Weak" } },
      ] },
    { id: "city", type: "text", required: false, label: { tr: "Hangi şehirde büyüdünüz?", en: "Which city did you grow up in?" } },
    { id: "seen_avatar", type: "radio", required: true, label: { tr: "Daha önce işaret dili yapan bir avatar ya da animasyon gördünüz mü?", en: "Have you seen a signing avatar or animation before?" },
      options: [{ value: "yes", label: { tr: "Evet", en: "Yes" } }, { value: "no", label: { tr: "Hayır", en: "No" } }] },
  ],

  instructions: {
    video: "",  // e.g. "media/instructions/instructions_tid.mp4"
    text: {
      tr: "Birinci bölümde her ekranda bir video göreceksiniz. Videoda bilgisayarla yapılmış üç boyutlu bir kişi (avatar) işaret yapar. Önce Türkçe cümleyi göstermeden videoyu izleyeceksiniz. Sonra ne anladığınızı yazacaksınız. Daha sonra asıl Türkçe cümleyi görüp çeviriyi puanlayacaksınız.\n\n" +
          "Puanlamadan sonra işaretlerin listesini göreceksiniz. Bir işarete tıklarsanız o işaret tekrar oynar. Yanlış ya da anlaşılmayan işaretleri işaretleyebilirsiniz.\n\n" +
          "İkinci bölümde aynı cümlenin iki çevirisini yan yana göreceksiniz ve hangisinin daha iyi olduğunu seçeceksiniz.",
      en: "In part one, each screen shows one video of a computer-animated 3D signer (avatar). First you watch it without the Turkish sentence and write what you understood. Then you see the original Turkish sentence and rate the translation.\n\n" +
          "After rating you will see the list of signs. Click a sign to replay it. You can mark wrong or unclear signs.\n\n" +
          "In part two you will see two translations of the same sentence side by side and choose the better one.",
    },
  },

  pairIntro: {
    video: "",
    text: {
      tr: "Bu bölümde aynı Türkçe cümlenin iki farklı çevirisini göreceksiniz (A ve B). İkisini de izleyin ve hangisinin daha iyi olduğunu seçin. Fark küçük olabilir; fark yoksa \"Aynı\" seçin.",
      en: "In this part you will see two translations of the same Turkish sentence (A and B). Watch both and choose the better one. The difference may be small; if there is none, choose \"Same\".",
    },
  },

  finalQuestions: [
    { id: "f_avatar", type: "radio", required: true,
      label: { tr: "Avatar videolarını anlamak ne kadar kolaydı?", en: "How easy was it to understand the avatar videos?" },
      options: [
        { value: "easy", label: { tr: "Kolay", en: "Easy" } },
        { value: "medium", label: { tr: "Orta", en: "Medium" } },
        { value: "hard", label: { tr: "Zor", en: "Hard" } },
      ] },
    { id: "f_missing", type: "textarea", required: false,
      label: { tr: "Çevirilerde en çok ne eksikti?", en: "What was missing most in the translations?" } },
    { id: "f_use", type: "textarea", required: false,
      label: { tr: "Böyle bir sistemi hangi durumlarda kullanırdınız? (örneğin hastane, resmi kurum, haber, eğitim)", en: "In which situations would you use such a system? (e.g., hospital, public office, news, education)" } },
    { id: "f_trust", type: "radio", required: true,
      label: { tr: "Bilgisayarın ürettiği bir TİD çevirisine güvenir miydiniz?", en: "Would you trust a computer-generated TİD translation?" },
      options: [
        { value: "yes", label: { tr: "Evet", en: "Yes" } },
        { value: "maybe", label: { tr: "Belki / duruma göre", en: "Maybe / it depends" } },
        { value: "no", label: { tr: "Hayır", en: "No" } },
      ] },
    { id: "f_other", type: "textarea", required: false, label: { tr: "Eklemek istediğiniz başka bir şey var mı?", en: "Anything else you would like to add?" } },
  ],

  // Expert panel (?mode=expert): 24 sentences × 3 avatar versions in sequence
  // (ours / gold gloss / retarget). No real-signer video. See app.js buildExpertPlan.
  expert: {
    consent: {
      video: "",
      text: {
        tr: "Bu çalışma Boğaziçi Üniversitesi Dilbilim Bölümü'nde yürütülen bir araştırmanın parçasıdır. Bilgisayarın Türkçeden Türk İşaret Dili'ne (TİD) yaptığı çevirileri uzman gözüyle değerlendirmenizi istiyoruz.\n\n" +
            "25 cümle vardır. Her cümle için üç videoyu art arda izleyeceksiniz (toplam 75 video): ikisi bilgisayarla yapılmış avatar, biri gerçek bir işaretçidir. Videolar A, B, C olarak gösterilir. Değerlendirme birden fazla oturumda yapılabilir.\n\n" +
            "Yanıtlarınız adınız olmadan, yalnızca bir kodla saklanır. İstediğiniz zaman bırakabilirsiniz. Etik kurul onayı: Boğaziçi Üniversitesi Beşeri Bilimler İnsan Araştırmaları Etik Kurulu (SBİNAREK), başvuru no 2025-78T, 17.11.2025 tarihli 2025/09 sayılı toplantı. Sorularınız için: onur.keles1@bogazici.edu.tr",
        en: "This study is part of research at the Department of Linguistics, Boğaziçi University. We ask you, as an expert, to evaluate computer translations from Turkish into Turkish Sign Language (TİD).\n\n" +
            "There are 25 sentences. For each sentence you watch three videos one after another (75 videos in total): two computer avatars and one real signer. Videos are labelled A, B, C. The evaluation can be done in several sessions.\n\n" +
            "Your answers are stored without your name, only with a code. You can stop at any time. Ethics approval: Boğaziçi University Humanities Human Research Ethics Committee (SBİNAREK), application no. 2025-78T, meeting 2025/09 of 17.11.2025. Contact: onur.keles1@bogazici.edu.tr",
      },
    },
    background: [
      { id: "ex_role", type: "radio", required: true, label: { tr: "Kendinizi nasıl tanımlarsınız?", en: "How do you describe yourself?" },
        options: [
          { value: "deaf", label: { tr: "Sağır TİD kullanıcısı", en: "Deaf TİD signer" } },
          { value: "coda", label: { tr: "İşiten, sağır ailede büyüdüm (CODA)", en: "Hearing, grew up in a Deaf family (CODA)" } },
          { value: "interpreter", label: { tr: "TİD tercümanı", en: "TİD interpreter" } },
          { value: "teacher", label: { tr: "TİD eğitmeni", en: "TİD teacher" } },
          { value: "researcher", label: { tr: "İşaret dili araştırmacısı", en: "Sign language researcher" } },
        ] },
      { id: "ex_tid_age", type: "radio", required: true, label: { tr: "TİD'i ne zaman öğrenmeye başladınız?", en: "When did you start learning TİD?" },
        options: [
          { value: "birth", label: { tr: "Doğuştan / ailemden", en: "From birth / from family" } },
          { value: "0-6", label: { tr: "Okul öncesi (0-6 yaş)", en: "Before school (age 0-6)" } },
          { value: "7-12", label: { tr: "İlkokulda (7-12 yaş)", en: "Primary school (age 7-12)" } },
          { value: "13+", label: { tr: "13 yaşından sonra", en: "After age 13" } },
        ] },
      { id: "ex_years", type: "text", required: true, label: { tr: "Kaç yıldır TİD kullanıyorsunuz (ya da tercümanlık / eğitmenlik yapıyorsunuz)?", en: "For how many years have you used TİD (or worked as an interpreter / teacher)?" } },
      // STUDY_V5C (Onur 2026-10-05): experts rate their TİD comprehension and production, not Turkish literacy
      { id: "ex_tid_understand", type: "radio", required: true, label: { tr: "TİD anlama becerinizi nasıl değerlendirirsiniz?", en: "How do you rate your TİD comprehension?" },
        options: [
          { value: "native", label: { tr: "Ana dil düzeyinde", en: "Native-like" } },
          { value: "very_good", label: { tr: "Çok iyi", en: "Very good" } },
          { value: "good", label: { tr: "İyi", en: "Good" } },
          { value: "medium", label: { tr: "Orta", en: "Medium" } },
          { value: "weak", label: { tr: "Zayıf", en: "Weak" } },
        ] },
      { id: "ex_tid_use", type: "radio", required: true, label: { tr: "TİD kullanma (işaretleme) becerinizi nasıl değerlendirirsiniz?", en: "How do you rate your TİD production (signing)?" },
        options: [
          { value: "native", label: { tr: "Ana dil düzeyinde", en: "Native-like" } },
          { value: "very_good", label: { tr: "Çok iyi", en: "Very good" } },
          { value: "good", label: { tr: "İyi", en: "Good" } },
          { value: "medium", label: { tr: "Orta", en: "Medium" } },
          { value: "weak", label: { tr: "Zayıf", en: "Weak" } },
        ] },
      { id: "ex_seen_avatar", type: "radio", required: true, label: { tr: "Daha önce işaret dili yapan bir avatar ya da animasyon gördünüz mü?", en: "Have you seen a signing avatar or animation before?" },
        options: [{ value: "yes", label: { tr: "Evet", en: "Yes" } }, { value: "no", label: { tr: "Hayır", en: "No" } }] },
    ],
    instructions: {
      video: "",
      text: {
        tr: "Her cümle için üç video art arda gelir. İkisi aynı üç boyutlu kişiyi (avatarı) gösterir ve farklı yöntemlerle üretilmiştir; biri gerçek bir işaretçinin videosudur. Gerçek videoyu da aynı sorularla değerlendirin. Videolar A, B, C diye adlandırılır.\n\n" +
            "1. İlk videoyu (A) Türkçe cümleyi görmeden izleyin ve ne anladığınızı Türkçe yazın.\n" +
            "2. Sonra Türkçe cümle gösterilir. Her video için altı soruyu cevaplayın (1–5): anlaşılırlık, işaretlerin doğruluğu, TİD dilbilgisi, hareketlerin doğallığı, anlamı ne kadar aktardığı ve eksik ya da yanlış bilgi olup olmadığı.\n" +
            "3. Aynı ekranda isterseniz sorunları işaretleyebilir ve kısa bir not yazabilirsiniz.\n\n" +
            "Ortada bir ara ekranı vardır. İstediğiniz zaman da durabilirsiniz; aynı bağlantıyı açınca kaldığınız yerden devam edersiniz.",
        en: "For each sentence you will see three videos one after another. Two show the same 3D signer (avatar), produced in different ways; one is a video of a real signer. Rate the real video with the same questions. Videos are labelled A, B, C.\n\n" +
            "1. Watch the first video (A) without the Turkish sentence and write in Turkish what you understood.\n" +
            "2. Then the Turkish sentence is shown. For each video answer six questions (1–5): understandability, correctness of the signs, TİD grammar, naturalness of the movement, how well it conveys the meaning, and whether information is missing or wrong.\n" +
            "3. On the same screen you can mark problems and write a short note if you like.\n\n" +
            "There is a break halfway through. You can also stop at any time; open the same link again to continue where you stopped.",
      },
    },
    finalQuestions: [
      { id: "ex_f_avatar", type: "textarea", required: false,
        label: { tr: "Avatarın işaretlemesinde en önemli sorunlar nelerdi?", en: "What were the most important problems in the avatar's signing?" } },
      { id: "ex_f_grammar", type: "textarea", required: false,
        label: { tr: "Çevirilerde en sık gördüğünüz TİD dilbilgisi hataları nelerdi?", en: "Which TİD grammar errors did you see most often in the translations?" } },
      { id: "ex_f_other", type: "textarea", required: false, label: { tr: "Eklemek istediğiniz başka bir şey var mı?", en: "Anything else you would like to add?" } },
    ],
  },

  // ------------------------------------------------------------------ Deaf study (?mode=deaf)
  // STUDY_V5_2026_10_05 (Onur): Deaf participants get a separate, simpler link. No Turkish
  // writing, no detailed diagnostics; one video per sentence and five 1-5 ratings. Short Turkish
  // texts; the `video` fields take TİD versions of the texts (strongly recommended).
  deaf: {
    consent: {
      video: "",  // e.g. "media/instructions/deaf_consent_tid.mp4"
      text: {
        tr: "Boğaziçi Üniversitesi'nde bir araştırma yapıyoruz. Bilgisayar Türkçeyi TİD'e çeviriyor. Videoları izleyip puan vereceksiniz.\n\n" +
            "25 video var. Yaklaşık 30 dakika sürer. Adınızı sormuyoruz. İstediğiniz zaman bırakabilirsiniz.\n\n" +
            "Etik kurul onayı: Boğaziçi Üniversitesi Beşeri Bilimler İnsan Araştırmaları Etik Kurulu (SBİNAREK), başvuru no 2025-78T, 17.11.2025 tarihli 2025/09 sayılı toplantı. İletişim: onur.keles1@bogazici.edu.tr",
        en: "We are doing research at Boğaziçi University. A computer translates Turkish into TİD. You will watch videos and give scores.\n\n" +
            "There are 25 videos. It takes about 30 minutes. We do not ask your name. You can stop at any time.\n\n" +
            "Ethics approval: Boğaziçi University Humanities Human Research Ethics Committee (SBİNAREK), application no. 2025-78T, meeting 2025/09 of 17.11.2025. Contact: onur.keles1@bogazici.edu.tr",
      },
    },
    background: [
      { id: "age", type: "radio", required: true, label: { tr: "Yaşınız", en: "Age" },
        options: ["18-29", "30-39", "40-49", "50-59", "60+"].map((v) => ({ value: v, label: v })) },
      { id: "hearing", type: "radio", required: true, label: { tr: "Siz:", en: "You are:" },
        options: [
          { value: "deaf", label: { tr: "Sağır", en: "Deaf" } },
          { value: "hoh", label: { tr: "Az işiten", en: "Hard of hearing" } },
        ] },
      { id: "tid_age", type: "radio", required: true, label: { tr: "TİD'i ne zaman öğrendiniz?", en: "When did you learn TİD?" },
        options: [
          { value: "birth", label: { tr: "Doğuştan / ailemden", en: "From birth / family" } },
          { value: "0-6", label: { tr: "Okuldan önce", en: "Before school" } },
          { value: "7-12", label: { tr: "İlkokulda", en: "Primary school" } },
          { value: "13+", label: { tr: "Daha sonra", en: "Later" } },
        ] },
      { id: "deaf_school", type: "radio", required: true, label: { tr: "Sağırlar okuluna gittiniz mi?", en: "Did you go to a Deaf school?" },
        options: [{ value: "yes", label: { tr: "Evet", en: "Yes" } }, { value: "no", label: { tr: "Hayır", en: "No" } }] },
      { id: "daily_use", type: "radio", required: true, label: { tr: "TİD'i ne sıklıkla kullanıyorsunuz?", en: "How often do you use TİD?" },
        options: [
          { value: "daily", label: { tr: "Her gün", en: "Every day" } },
          { value: "weekly", label: { tr: "Haftada birkaç kez", en: "A few times a week" } },
          { value: "less", label: { tr: "Daha az", en: "Less" } },
        ] },
      // STUDY_V5E: Turkish reading level (the Turkish sentence is shown after each video)
      { id: "tr_read", type: "radio", required: true, label: { tr: "Türkçe okumanız nasıl?", en: "How is your Turkish reading?" },
        options: [
          { value: "very_good", label: { tr: "Çok iyi", en: "Very good" } },
          { value: "good", label: { tr: "İyi", en: "Good" } },
          { value: "medium", label: { tr: "Orta", en: "Medium" } },
          { value: "weak", label: { tr: "Zayıf", en: "Weak" } },
        ] },
      { id: "seen_avatar", type: "radio", required: true, label: { tr: "Daha önce işaret dili yapan avatar gördünüz mü?", en: "Have you seen a signing avatar before?" },
        options: [{ value: "yes", label: { tr: "Evet", en: "Yes" } }, { value: "no", label: { tr: "Hayır", en: "No" } }] },
    ],
    instructions: {
      video: "",  // e.g. "media/instructions/deaf_instructions_tid.mp4"
      text: {
        tr: "Her ekranda bir video var. Bazı videolarda bilgisayar avatarı, bazılarında gerçek bir kişi işaret yapıyor.\n\n" +
            "1. Videoyu sonuna kadar izleyin.\n" +
            "2. Ne kadar anladığınıza 1 ile 5 arasında puan verin.\n" +
            "3. Sonra videonun Türkçe cümlesini göreceksiniz. Birkaç soruya daha 1 ile 5 arasında puan verin. 1 = çok kötü, 5 = çok iyi.\n\n" +
            "Videoyu istediğiniz kadar tekrar izleyebilirsiniz. Önce bir deneme video var.",
        en: "Each screen has one video. In some videos a computer avatar signs, in others a real person.\n\n" +
            "1. Watch the video to the end.\n" +
            "2. Score how much you understood, from 1 to 5.\n" +
            "3. Then you see the Turkish sentence of the video. Answer a few more questions from 1 to 5. 1 = very bad, 5 = very good.\n\n" +
            "You can watch the video again as often as you like. First there is a practice video.",
      },
    },
    practiceTitle: { tr: "Deneme", en: "Practice" },
    watchHint: { tr: "Videoyu sonuna kadar izleyin. Sonra sorular gelecek.", en: "Watch the video to the end. Then the questions appear." },
    // STUDY_V5E (Onur 2026-10-05): no Turkish writing for Deaf participants; step 2 is only question 1
    writeUnderstanding: false,
    needUnderstand: { tr: "Lütfen 1. soruya puan verin.", en: "Please score question 1." },
    // Step 3 (Turkish sentence shown)
    sourceLabel: { tr: "Videonun Türkçe cümlesi:", en: "The Turkish sentence of the video:" },
    needRatings: { tr: "Lütfen bütün sorulara cevap verin.", en: "Please answer all questions." },
    // step: "understand" = asked with the writing box, before the Turkish sentence; "meaning" / "rate" = after.
    // type "choice3" = three buttons (none / a little / a lot); default = 1-5 scale.
    ratings: [
      { id: "understand", step: "understand", label: { tr: "1. Ne kadar anladınız?", en: "1. How much did you understand?" },
        lo: { tr: "Hiç anlamadım", en: "Nothing" }, hi: { tr: "Hepsini anladım", en: "Everything" } },
      { id: "meaning", step: "meaning", label: { tr: "2. Video bu Türkçe cümleyi doğru anlatıyor mu?", en: "2. Does the video say this Turkish sentence correctly?" },
        lo: { tr: "Hiç doğru değil", en: "Not at all" }, hi: { tr: "Tamamen doğru", en: "Completely" } },
      { id: "missing", step: "meaning", type: "choice3", label: { tr: "3. Videoda eksik ya da yanlış bir şey var mı?", en: "3. Is anything missing or wrong in the video?" },
        options: [
          { value: "none", label: { tr: "Yok", en: "No" } },
          { value: "some", label: { tr: "Biraz var", en: "A little" } },
          { value: "much", label: { tr: "Çok var", en: "A lot" } },
        ] },
      { id: "hands", step: "rate", label: { tr: "4. El işaretleri doğru mu?", en: "4. Are the hand signs correct?" },
        lo: { tr: "Çok yanlış", en: "Very wrong" }, hi: { tr: "Çok doğru", en: "Very correct" } },
      { id: "natural", step: "rate", label: { tr: "5. Bu cümle doğal mı?", en: "5. Is this sentence natural?" },
        lo: { tr: "Hiç doğal değil", en: "Not natural" }, hi: { tr: "Çok doğal", en: "Very natural" } },
      { id: "flow", step: "rate", label: { tr: "6. Hareketler akıcı mı?", en: "6. Is the movement smooth?" },
        lo: { tr: "Hiç akıcı değil", en: "Not smooth" }, hi: { tr: "Çok akıcı", en: "Very smooth" } },
      { id: "overall", step: "rate", label: { tr: "7. Genel olarak bu TİD cümlesi nasıl?", en: "7. Overall, how is this TİD sentence?" },
        lo: { tr: "Çok kötü", en: "Very bad" }, hi: { tr: "Çok iyi", en: "Very good" } },
    ],
    finalQuestions: [
      { id: "d_f_easy", type: "radio", required: true, label: { tr: "Avatar videolarını anlamak kolay mıydı?", en: "Were the avatar videos easy to understand?" },
        options: [
          { value: "easy", label: { tr: "Kolay", en: "Easy" } },
          { value: "medium", label: { tr: "Orta", en: "Medium" } },
          { value: "hard", label: { tr: "Zor", en: "Hard" } },
        ] },
      { id: "d_f_use", type: "radio", required: true, label: { tr: "Böyle bir avatarı kullanır mısınız?", en: "Would you use such an avatar?" },
        options: [
          { value: "yes", label: { tr: "Evet", en: "Yes" } },
          { value: "maybe", label: { tr: "Belki", en: "Maybe" } },
          { value: "no", label: { tr: "Hayır", en: "No" } },
        ] },
      { id: "d_f_comment", type: "textarea", required: false, label: { tr: "Yorumunuz (isterseniz)", en: "Comment (optional)" } },
    ],
  },

  thanksVideo: "",

  design: {
    // Block-1 conditions, rotated across items by list number (Latin square).
    // build_stimuli.py overwrites this with the conditions it actually produced.
    // Participant study: avatar only (real-signer "reference" videos are not shown).
    block1Conditions: ["avatar"],
    randomizeItems: true,
    // expert panel: three avatar versions, sequential; "avatar" is ours (predicted gloss + stitching)
    expertConditions: ["avatar", "gold", "reference"],   // STUDY_V5: ours, gold-gloss avatar, real signer
    // Deaf study (?mode=deaf): each sentence once, avatar or real signer by list (Latin square)
    deafConditions: ["avatar", "reference"],
    expertOurs: "avatar",
  },

  items: [],
  pairs: [],
  practice: [],
};
