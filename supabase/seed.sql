-- Seed one published invitation so `/inka-riyadi` renders from the DB.
-- The `customization` JSON is a valid forge-ui-dos InvitationConfig — it mirrors
-- the design system's authored sample (names swapped to Inka & Riyadi). This is
-- the same content the in-memory fallback builds when Supabase isn't connected.
insert into public.sites (slug, couple_names, published_at, customization)
values (
  'inka-riyadi',
  'Inka & Riyadi',
  now(),
  $json$
{
  "layout": { "type": "single" },
  "theme": {},
  "chrome": { "nav": true, "language": true },
  "sections": [
    { "type": "cover", "props": {
      "brideName": "Inka", "groomName": "Riyadi",
      "dateLabel": "Sabtu · 12 Desember 2026",
      "guestName": "Tamu Undangan"
    }},
    { "type": "welcome", "props": {
      "eyebrow": "Welcome to our day",
      "title": "With joy & gratitude",
      "message": "This little website was personally made to celebrate this beautiful chapter with the people who have walked with us along the way. Thank you for being here.",
      "signature": "Inka & Riyadi"
    }},
    { "type": "quote", "props": {
      "source": "QS. Ar-Rum: 21",
      "children": "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya…"
    }},
    { "type": "couple",
      "heading": { "eyebrow": "Meet the Bride & Groom", "title": "Mempelai" },
      "props": {
        "bride": { "name": "Inka", "fullName": "Inka Ayu Lestari", "parentage": "Putri dari Bpk. Hendra & Ibu Sari", "instagram": "inka" },
        "groom": { "name": "Riyadi", "fullName": "Riyadi Ramadhan", "parentage": "Putra dari Bpk. Rudi & Ibu Wati", "instagram": "riyadi" }
      }},
    { "type": "loveStory",
      "heading": { "eyebrow": "Our Journey", "title": "The Road To Us", "tone": "surface" },
      "props": { "milestones": [
        { "period": "2019", "title": "First Meet", "body": "Dipertemukan di sebuah acara kampus." },
        { "period": "2022", "title": "The Journey", "body": "Menjalani hubungan jarak jauh penuh kesabaran." },
        { "period": "2026", "title": "Forever", "body": "Memutuskan melangkah ke jenjang pernikahan." }
      ]}},
    { "type": "event",
      "heading": { "eyebrow": "Save the Date", "title": "The Wedding Day" },
      "props": { "sessions": [
        { "title": "Akad Nikah", "dateLabel": "Sabtu, 12 Desember 2026", "timeLabel": "08.00 – 10.00 WIB",
          "venueName": "Masjid Agung", "address": "Jl. Merdeka No. 1, Bandung", "mapsUrl": "https://maps.google.com",
          "calendar": { "title": "Akad Nikah Inka & Riyadi", "start": "2026-12-12T08:00:00", "end": "2026-12-12T10:00:00", "location": "Masjid Agung, Bandung" } },
        { "title": "Resepsi", "dateLabel": "Sabtu, 12 Desember 2026", "timeLabel": "11.00 – 14.00 WIB",
          "venueName": "Balai Sartika", "address": "Jl. Merdeka No. 2, Bandung", "mapsUrl": "https://maps.google.com" }
      ]}},
    { "type": "countdown",
      "heading": { "title": "Counting Down", "tone": "surface" },
      "props": { "target": "2026-12-12T08:00:00" }},
    { "type": "gallery",
      "heading": { "eyebrow": "Gallery", "title": "Moments" },
      "props": { "images": [
        "https://picsum.photos/seed/dos0/400/400",
        "https://picsum.photos/seed/dos1/400/400",
        "https://picsum.photos/seed/dos2/400/400",
        "https://picsum.photos/seed/dos3/400/400",
        "https://picsum.photos/seed/dos4/400/400",
        "https://picsum.photos/seed/dos5/400/400"
      ]}},
    { "type": "rsvp",
      "heading": { "eyebrow": "Be Part of Our Day", "title": "RSVP" },
      "props": { "defaultName": "Tamu Undangan" }},
    { "type": "guestbook",
      "heading": { "eyebrow": "A Wall of Love", "title": "Doa & Ucapan", "tone": "surface" },
      "props": { "messages": [
        { "name": "Rani", "message": "Selamat menempuh hidup baru! 🤍" },
        { "name": "Dimas", "message": "Bahagia selalu untuk kalian berdua." }
      ]}},
    { "type": "gift",
      "heading": { "eyebrow": "A Token of Love", "title": "Wedding Gift" },
      "props": { "accounts": [
        { "provider": "BCA", "number": "1234 5678 90", "holder": "Inka Ayu Lestari" },
        { "provider": "GoPay", "number": "0812 3456 7890", "holder": "Riyadi Ramadhan" }
      ]}},
    { "type": "wishlist",
      "heading": { "eyebrow": "Our Wishlist", "title": "Wedding Wishlist", "tone": "surface" },
      "props": { "items": [
        { "id": "1", "name": "Coffee Machine", "description": "Espresso maker untuk pagi berdua.", "price": "± Rp 2.500.000", "shopUrl": "https://example.com" },
        { "id": "2", "name": "Air Purifier", "description": "Udara bersih di rumah baru.", "price": "± Rp 1.200.000", "claimedBy": "Keluarga Sari" }
      ]}},
    { "type": "liveStream",
      "heading": { "title": "Live Streaming" },
      "props": { "url": "https://youtube.com", "platform": "YouTube Live", "note": "Bagi yang berhalangan hadir, saksikan momen kami secara langsung." }},
    { "type": "closing", "props": {
      "brideName": "Inka", "groomName": "Riyadi", "hashtag": "#InkaRiyadi",
      "message": "Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu berkenan hadir memberikan doa restu."
    }}
  ]
}
  $json$::jsonb
)
on conflict (slug) do update
  set couple_names = excluded.couple_names,
      customization = excluded.customization,
      published_at = excluded.published_at;
