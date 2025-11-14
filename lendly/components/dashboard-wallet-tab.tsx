"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: "deposit" | "payout" | "refund";
  amount: number;
  description: string;
  date: string;
  status: "pending" | "completed" | "failed";
}

export function WalletTab() {
  const t = useTranslations("dashboard.wallet");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    // Mock data for MVP
    setBalance(1250.50);
    setTransactions([
      {
        id: "1",
        type: "deposit",
        amount: 500,
        description: "Deposit for Canon EOS R5 rental",
        date: new Date().toISOString(),
        status: "completed",
      },
      {
        id: "2",
        type: "payout",
        amount: -250,
        description: "Payout from DJI Mavic 3 rental",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "completed",
      },
      {
        id: "3",
        type: "refund",
        amount: 1000.50,
        description: "Refund for cancelled booking",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "completed",
      },
    ]);
  };

  const handleExport = () => {
    const csv = [
      ["Date", "Type", "Amount", "Description", "Status"],
      ...transactions.map((t) => [
        format(new Date(t.date), "yyyy-MM-dd"),
        t.type,
        t.amount.toString(),
        t.description,
        t.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {t("balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₪{balance.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-2">{t("balanceDescription")}</p>
        </CardContent>
      </Card>

      {/* Transactions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("transactions")}</h2>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          {t("exportCSV")}
        </Button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">{t("empty")}</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{transaction.description}</span>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "PPp")}
                    </p>
                  </div>
                  <div className={`text-lg font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : ""}₪{Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

