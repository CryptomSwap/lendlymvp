"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations, useLocale } from "next-intl";
import { RenterTab } from "./dashboard-renter-tab";
import { OwnerTab } from "./dashboard-owner-tab";
import { MessagesTab } from "./dashboard-messages-tab";
import { WalletTab } from "./dashboard-wallet-tab";
import { SettingsTab } from "./dashboard-settings-tab";
import { motion } from "framer-motion";

export function DashboardTabs() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isRTL = locale === "he";
  const [activeTab, setActiveTab] = useState("renter");

  const tabVariants = {
    hidden: { opacity: 0, x: isRTL ? 20 : -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="renter">{t("tabs.renter")}</TabsTrigger>
          <TabsTrigger value="owner">{t("tabs.owner")}</TabsTrigger>
          <TabsTrigger value="messages">{t("tabs.messages")}</TabsTrigger>
          <TabsTrigger value="wallet">{t("tabs.wallet")}</TabsTrigger>
          <TabsTrigger value="settings">{t("tabs.settings")}</TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={tabVariants}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="renter" className="mt-0">
            <RenterTab />
          </TabsContent>

          <TabsContent value="owner" className="mt-0">
            <OwnerTab />
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="wallet" className="mt-0">
            <WalletTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsTab />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}

