"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";

// Functions can't cross the server/client boundary, so error handling for the
// client tree is configured here instead of in request.js.
const onError = (error) => {
  if (error.code === "MISSING_MESSAGE") return;
  throw error;
};

const getMessageFallback = ({ key }) => key.split(".").pop();

export const ClientProvider = ({ locale, messages, timeZone, children }) => (
  <NextIntlClientProvider
    locale={locale}
    messages={messages}
    timeZone={timeZone}
    onError={onError}
    getMessageFallback={getMessageFallback}
  >
    {children}
  </NextIntlClientProvider>
);
