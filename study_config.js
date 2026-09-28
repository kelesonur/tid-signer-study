/* Hand-edited study texts and settings.
 * Items, pairs and practice trials are added by stimuli.js (build_stimuli.py).
 * Every text can be {tr: "...", en: "..."}; optional `video` fields take a
 * path to a TİD instruction video (strongly recommended for Deaf participants).
 * Lines marked [DOLDURUN] must be completed before the study starts.
 */
window.STUDY = {
  studyId: "tid-gen-eval-2026",
  version: "2",  // 2 = Rocketbox avatar instead of the skeleton (28 Sep 2026)
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
          "Yanıtlarınız adınız olmadan, yalnızca bir katılımcı koduyla saklanır. Çalışmayı istediğiniz zaman bırakabilirsiniz. Etik kurul onay numarası: [DOLDURUN]. Sorularınız için: [DOLDURUN e-posta].",
      en: "This study is part of research at the Department of Linguistics, Boğaziçi University. We want to learn how understandable and natural computer-generated Turkish Sign Language (TİD) translations are.\n\n" +
          "The study takes about [FILL IN] minutes. You will watch videos, write what you understood, and rate the translations. There are no right or wrong answers; we are testing the computer system, not you.\n\n" +
          "Your answers are stored without your name, only with a participant code. You can stop at any time. Ethics approval number: [FILL IN]. Contact: [FILL IN e-mail].",
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
    { id: "city", type: "text", required: false, label: { tr: "Hangi şehirde büyüdünüz?", en: "Which city did you grow up in?" } },
    { id: "seen_avatar", type: "radio", required: true, label: { tr: "Daha önce işaret dili yapan bir avatar ya da animasyon gördünüz mü?", en: "Have you seen a signing avatar or animation before?" },
      options: [{ value: "yes", label: { tr: "Evet", en: "Yes" } }, { value: "no", label: { tr: "Hayır", en: "No" } }] },
  ],

  instructions: {
    video: "",  // e.g. "media/instructions/instructions_tid.mp4"
    text: {
      tr: "Birinci bölümde her ekranda bir video göreceksiniz. Önce Türkçe cümleyi göstermeden videoyu izleyeceksiniz. Sonra ne anladığınızı yazacaksınız. Daha sonra asıl Türkçe cümleyi görüp çeviriyi puanlayacaksınız.\n\n" +
          "Videoların bazılarında bilgisayarla yapılmış üç boyutlu bir kişi (avatar) işaret yapar, diğerlerinde gerçek bir kişi cümleyi işaret eder.\n\n" +
          "Puanlamadan sonra işaretlerin listesini göreceksiniz. Bir işarete tıklarsanız o işaret tekrar oynar. Yanlış ya da anlaşılmayan işaretleri işaretleyebilirsiniz.\n\n" +
          "İkinci bölümde aynı cümlenin iki çevirisini yan yana göreceksiniz ve hangisinin daha iyi olduğunu seçeceksiniz.",
      en: "In part one, each screen shows one video. First you watch it without the Turkish sentence and write what you understood. Then you see the original Turkish sentence and rate the translation.\n\n" +
          "Some videos show a computer-animated 3D signer (avatar); in the others a real person signs the sentence.\n\n" +
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

  thanksVideo: "",

  design: {
    // Block-1 conditions, rotated across items by list number (Latin square).
    // build_stimuli.py overwrites this with the conditions it actually produced.
    block1Conditions: ["avatar", "reference"],
    randomizeItems: true,
  },

  items: [],
  pairs: [],
  practice: [],
};
