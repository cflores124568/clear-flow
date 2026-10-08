#!/usr/bin/env bash
# Builds hero-dusty.jpg from hero-clean.jpg: the same frame with a dust film,
# fine grit and dried water spots. The hero wipe clips between the two, so they
# must stay pixel-aligned. Rerun this whenever hero-clean.jpg changes.
# Needs ImageMagick 7 (`brew install imagemagick`).
set -euo pipefail
cd "$(dirname "$0")/../src/assets/photos"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

W=$(magick identify -format %w hero-clean.jpg)
H=$(magick identify -format %h hero-clean.jpg)

magick -size "${W}x${H}" xc:gray50 -seed 7 +noise Random -colorspace Gray -threshold 97% -blur 0x0.8 "$tmp/fine.png"
magick -size "$((W / 6))x$((H / 6))" xc:gray50 -seed 11 +noise Random -colorspace Gray -threshold 99% \
	-filter Gaussian -resize "${W}x${H}!" -blur 0x2.2 -level 3%,40% "$tmp/spots.png"
magick -size "$((W / 40))x$((H / 40))" xc:gray50 -seed 3 +noise Random -colorspace Gray \
	-filter Gaussian -resize "${W}x${H}!" -blur 0x30 -level 30%,70% "$tmp/film.png"

magick hero-clean.jpg -blur 0x2.2 -modulate 104,62 \
	\( -size "${W}x${H}" xc:'#E6DFD1' "$tmp/film.png" -alpha off -compose CopyOpacity -composite -channel A -evaluate multiply 0.42 +channel \) -compose over -composite \
	\( -size "${W}x${H}" xc:'#F3EEE4' "$tmp/fine.png" -alpha off -compose CopyOpacity -composite -channel A -evaluate multiply 0.7 +channel \) -compose over -composite \
	\( -size "${W}x${H}" xc:'#EFE8DA' "$tmp/spots.png" -alpha off -compose CopyOpacity -composite -channel A -evaluate multiply 0.8 +channel \) -compose over -composite \
	-quality 86 hero-dusty.jpg

echo "Wrote hero-dusty.jpg (${W}x${H})"
