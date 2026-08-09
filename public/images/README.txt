Local images (not managed in Sanity)
====================================

Footer certification logo
-------------------------
Active file (wired in lib/local-images.ts):

  Sadhguru_Gurukulam_Logo.webp

Do not use .avif for this badge: Cloudflare Image Transformations returns
HTTP 415 when AVIF is used as a transform *source* (raw AVIF still serves).

Original AVIF may remain on disk as a rebuild source only.

Program photos
--------------
Save each program image in the programs/ folder using the program slug as the filename
(prefer .webp; .jpg / .png also work):

  programs/angamardana.webp
  programs/bhastrika-kriya.webp
  …

About page photos
-----------------
Save each about section image in the about/ folder using a slug derived from the section title:

  about/sadhguru.jpg
  about/isha-yoga-center.jpg
  about/isha-hatha-yoga-teacher-training.jpg
  about/isha-foundation.jpg
  about/teacher-linda.webp

Brand logos (wired in lib/constants.ts) use optimized .webp sources at display-appropriate sizes.
Original PNGs may remain on disk as rebuild sources only.

Supported formats: .webp, .jpg, .jpeg, .png, .avif

Optional program symbols (detail page header)
-------------------------------------------
  programs/{slug}-symbol.png

Until a file is added, a calm placeholder is shown automatically.
