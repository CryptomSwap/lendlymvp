import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  const faqs = [
    {
      category: "Security Deposits",
      questions: [
        {
          question: "What is the security deposit?",
          answer: "A security deposit is a refundable amount held to cover potential damage or loss of the rented item. It's calculated based on the item's value and rental duration. The deposit is fully refunded when you return the item in the same condition as received."
        },
        {
          question: "How is the deposit amount calculated?",
          answer: "The deposit amount is calculated based on the item's estimated value and the rental duration. Higher-value items and longer rental periods typically require larger deposits. You can see the exact deposit amount before confirming your reservation."
        },
        {
          question: "When will I get my deposit back?",
          answer: "Your deposit is refunded within 3-5 business days after you return the item, provided it's in the same condition as when you received it. The owner will inspect the item and confirm the return before the refund is processed."
        },
        {
          question: "What happens if there's damage to the item?",
          answer: "If the item is damaged or not returned, the owner can file a dispute through our platform. Our support team will review photos and evidence from both parties and determine if any deposit deduction is warranted. You'll be notified of any decisions and can appeal if needed."
        }
      ]
    },
    {
      category: "Insurance",
      questions: [
        {
          question: "How does insurance work?",
          answer: "Lendly offers optional insurance coverage for your rentals. When booking an item, you can choose to add insurance which provides additional protection against damage, theft, or loss. Insurance costs are calculated as a percentage of the rental value and are non-refundable."
        },
        {
          question: "What does insurance cover?",
          answer: "Insurance typically covers accidental damage, theft, and loss of the rented item. It does not cover intentional damage, misuse, or damage from prohibited activities. Review the insurance terms for specific coverage details before purchasing."
        },
        {
          question: "Is insurance mandatory?",
          answer: "No, insurance is optional. However, we recommend purchasing insurance for high-value items or if you're concerned about potential damage. The security deposit is still required regardless of insurance coverage."
        },
        {
          question: "How do I file an insurance claim?",
          answer: "If you need to file an insurance claim, contact our support team immediately after the incident. You'll need to provide photos, a description of what happened, and any relevant documentation. Our team will review your claim and process it according to the insurance terms."
        }
      ]
    },
    {
      category: "Bookings & Rentals",
      questions: [
        {
          question: "What if something breaks during my rental?",
          answer: "If something breaks during your rental period, contact the owner immediately through the messaging system. Take photos of the damage and document what happened. Depending on the circumstances, you may be responsible for repair or replacement costs, which could be deducted from your security deposit. If you purchased insurance, it may cover some or all of these costs."
        },
        {
          question: "Can I cancel my reservation?",
          answer: "Yes, you can cancel your reservation, but cancellation policies vary. If you cancel before the owner approves your request, there's typically no charge. If you cancel after approval, cancellation fees may apply depending on how close to the rental start date you cancel. Check the specific listing for cancellation policy details."
        },
        {
          question: "What if the owner cancels my booking?",
          answer: "If an owner cancels your confirmed booking, you'll receive a full refund including any deposit. We may also help you find alternative options. Owners who frequently cancel may face penalties or restrictions on the platform."
        },
        {
          question: "How do I extend my rental period?",
          answer: "To extend your rental period, contact the owner through the messaging system to request an extension. If they agree, you can modify the booking through the platform. Additional charges will apply for the extended period."
        }
      ]
    },
    {
      category: "Payments",
      questions: [
        {
          question: "When do I pay for my rental?",
          answer: "You pay when you pick up the item. The rental fee is charged at pickup, and the security deposit is authorized (held) when your booking is confirmed. The deposit is only charged if there are issues with the return."
        },
        {
          question: "What payment methods are accepted?",
          answer: "Lendly accepts major credit cards and debit cards. Payment is processed securely through our platform. You'll need to have a valid payment method on file to make reservations."
        },
        {
          question: "Are there any additional fees?",
          answer: "In addition to the daily rental rate, you may see a security deposit (refundable), optional insurance fees, and a small platform service fee. All fees are clearly displayed before you confirm your reservation."
        }
      ]
    },
    {
      category: "Account & Verification",
      questions: [
        {
          question: "Do I need to verify my account?",
          answer: "Account verification is required to list items for rent and is recommended for all users. Verification helps build trust in the community and may be required for certain high-value rentals. You can verify your account by uploading a government-issued ID."
        },
        {
          question: "What is a trust score?",
          answer: "Your trust score is a rating based on your activity on the platform, including completed bookings, reviews from other users, and account verification status. Higher trust scores can help you get approved for more bookings and may allow you to list more items."
        },
        {
          question: "How do I improve my trust score?",
          answer: "You can improve your trust score by completing bookings successfully, receiving positive reviews, verifying your account, and maintaining a good track record on the platform. Avoid cancellations, disputes, and negative reviews."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-4xl">
      <div className="text-center mb-8">
        <HelpCircle className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about using Lendly
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardContent className="p-6">
              <h2 className="text-h3 mb-4 text-[#009999]">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-gradient-to-br from-[#E8F6F6] to-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-h2 mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-[#009999] hover:bg-[#007777]">
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline">
                Back to Help Center
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

