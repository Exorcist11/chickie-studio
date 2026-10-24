package com.chickiestudio.common.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtils {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern MULTIPLE_DASHES = Pattern.compile("-{2,}");
    private static final Pattern EDGES_DASHES = Pattern.compile("(^-+|-+$)");

    private SlugUtils() {
        // Utility class
    }

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        String normalized = input.trim()
                .replace("đ", "d")
                .replace("Đ", "d");

        normalized = Normalizer.normalize(normalized, Normalizer.Form.NFD);
        normalized = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("");

        String noWhitespace = WHITESPACE.matcher(normalized).replaceAll("-");
        String normalizedLatin = NON_LATIN.matcher(noWhitespace).replaceAll("");
        String singleDashes = MULTIPLE_DASHES.matcher(normalizedLatin).replaceAll("-");
        String slug = EDGES_DASHES.matcher(singleDashes).replaceAll("").toLowerCase(Locale.ENGLISH);

        return slug;
    }
}
