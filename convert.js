const fs = require("fs");
const builder = require("xmlbuilder2");

const jsonData = JSON.parse(fs.readFileSync("data.json", "utf-8"));

const root = builder
  .create({
    version: "1.0",
    encoding: "UTF-8",
    standalone: "no",
  })
  .ele("oclcPersonas", {
    xmlns: "http://worldcat.org/xmlschemas/IDMPersonas-2.2",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:schemaLocation":
      "http://worldcat.org/xmlschemas/IDMPersonas-2.2 http://worldcat.org/xmlschemas/IDMPersonas/2.2/IDMPersonas-2.2.xsd",
  });

jsonData.forEach((patron) => {
  const persona = root.ele("persona", { institutionId: "2989" });

  persona
    .ele("correlationInfo")
    .ele("sourceSystem")
    .txt(patron.sourceSystem)
    .up()
    .ele("idAtSource")
    .txt(patron.idAtSource_id)
    .up()
    .up();

  persona
    .ele("correlationInfo")
    .ele("sourceSystem")
    .txt(patron.sourceSystem)
    .up()
    .ele("idAtSource")
    .txt(patron.idAtSource_email)
    .up()
    .up();

  const nameInfo = persona.ele("nameInfo");
  nameInfo.ele("givenName").txt(patron.givenName);
  if (patron.middleName) nameInfo.ele("middleName").txt(patron.middleName);
  nameInfo.ele("familyName").txt(patron.familyName);

  persona.ele("gender").txt(patron.gender);

  const circ = persona.ele("wmsCircPatronInfo");
  circ.ele("barcode").txt(patron.barcode);
  circ.ele("borrowerCategory").txt(patron.borrowerCategory);
  if (patron.homeBranch) circ.ele("homeBranch").txt(patron.homeBranch);

  const ill = persona.ele("wsILLInfo");
  ill.ele("illId").txt(patron.illId);
  if (patron.illPatronType) ill.ele("illPatronType").txt(patron.illPatronType);

  const contact = persona.ele("contactInfo");

  const email = contact.ele("email");
  email.ele("emailAddress").txt(patron.emailAddress);
  email.ele("isPrimary").txt(patron.isPrimary_email.toString());

  const addr = contact.ele("postalAddress");
  addr.ele("streetAddressLine1").txt(patron.streetAddressLine1);
  if (patron.streetAddressLine2)
    addr.ele("streetAddressLine2").txt(patron.streetAddressLine2);
  addr.ele("cityOrLocality").txt(patron.cityOrLocality);
  addr.ele("stateOrProvince").txt(patron.stateOrProvince);
  addr.ele("postalCode").txt(patron.postalCode);
  addr.ele("country").txt(patron.country);
  addr.ele("isPrimary").txt(patron.isPrimary_address.toString());
});

const xmlData = root.end({ prettyPrint: true });
fs.writeFileSync("oclc_patron.xml", xmlData);

console.log(" JSON converted to OCLC XML successfully!");
