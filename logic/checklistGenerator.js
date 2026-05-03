export function generateChecklist(options) {
  const {
    disasterType,
    familySize,
    hasBaby,
    hasElderly,
    hasPets,
    needsMedicine,
  } = options;

  const checklist = [
    "Drinking water",
    "Ready-to-eat food",
    "Flashlight",
    "Extra batteries",
    "Power bank",
    "Whistle",
    "First aid kit",
    "Face masks",
    "Alcohol or sanitizer",
    "Important documents in waterproof bag",
    "Extra clothes",
    "Cash",
    "Phone with emergency contacts saved",
  ];

  if (familySize > 1) {
    checklist.push(`Food and water for ${familySize} people`);
  }

  if (hasBaby) {
    checklist.push("Baby formula or milk");
    checklist.push("Diapers");
    checklist.push("Baby wipes");
    checklist.push("Extra baby clothes");
  }

  if (hasElderly) {
    checklist.push("Senior citizen ID");
    checklist.push("Mobility support such as cane or wheelchair if needed");
    checklist.push("Maintenance medicine");
  }

  if (hasPets) {
    checklist.push("Pet food");
    checklist.push("Pet water bowl");
    checklist.push("Pet leash or carrier");
    checklist.push("Pet vaccination record if available");
  }

  if (needsMedicine) {
    checklist.push("Prescription medicine");
    checklist.push("Medical records");
    checklist.push("Doctor contact information");
  }

  if (disasterType === "flood") {
    checklist.push("Waterproof boots or slippers");
    checklist.push("Plastic bags for electronics");
    checklist.push("Rope");
    checklist.push("Avoid walking or driving through floodwater");
  }

  if (disasterType === "typhoon") {
    checklist.push("Secure windows before the storm");
    checklist.push("Check roof and loose objects outside");
    checklist.push("Battery-powered radio if available");
    checklist.push("Stay away from windows during strong winds");
  }

  if (disasterType === "earthquake") {
    checklist.push("Know safe spots under sturdy tables");
    checklist.push("Prepare shoes near your bed");
    checklist.push("Avoid elevators after shaking");
    checklist.push("Check for gas leaks after the earthquake");
  }

  return checklist;
}