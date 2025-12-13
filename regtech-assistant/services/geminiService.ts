import { Clause, ChecklistItem } from "../types";

// Mock Service simulating AI behavior without the @google/genai dependency

export const extractClauses = async (text: string): Promise<Clause[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return [
    {
      id: `clause-mock-1`,
      title: "Article 5 - Governance and organisation",
      content: "Financial entities shall have in place an internal governance and control framework that ensures an effective and prudent management of ICT risk to achieve a high level of digital operational resilience.",
      riskLevel: "high",
      tags: ["Governance", "ICT Risk"],
      page: 1
    },
    {
      id: `clause-mock-2`,
      title: "Article 6 - ICT risk management framework",
      content: "Financial entities shall have a sound, comprehensive and well-documented ICT risk management framework as part of their overall risk management system.",
      riskLevel: "high",
      tags: ["Risk Management", "Compliance"],
      page: 1
    },
    {
      id: `clause-mock-3`,
      title: "Article 6(2) - Security Policies",
      content: "The ICT risk management framework shall include at least strategies, policies, procedures, ICT protocols and tools that are necessary to safeguard the confidentiality, integrity and availability of information assets.",
      riskLevel: "medium",
      tags: ["Security", "Policies"],
      page: 1
    }
  ];
};

export const generateChecklist = async (docTitle: string, clauses: Clause[]): Promise<ChecklistItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  return [
    {
      id: "check-mock-1",
      text: "Establish internal governance framework for ICT risk management",
      isMandatory: true,
      checked: false
    },
    {
      id: "check-mock-2",
      text: "Approve and oversee ICT risk management framework (Management Body)",
      isMandatory: true,
      checked: false
    },
    {
      id: "check-mock-3",
      text: "Document strategies and protocols for information asset security",
      isMandatory: true,
      checked: false
    },
    {
      id: "check-mock-4",
      text: "Verify alignment with overall risk management system",
      isMandatory: false,
      checked: false
    }
  ];
};

export const analyzeDiff = async (oldText: string, newText: string): Promise<string> => {
   // Simulate network delay
   await new Promise(resolve => setTimeout(resolve, 800));
   
   return "The updated regulation significantly expands the governance requirements. It explicitly mandates an 'effective and prudent management of ICT risk' and requires the framework to be 'well-documented', whereas the previous version was more generic regarding the management body's specific accountabilities.";
}