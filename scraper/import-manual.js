/**
 * Manual import — paste law article text into the `articles` array below
 * then run: node import-manual.js
 *
 * How to get text from lex.uz manually:
 * 1. Open lex.uz in Chrome
 * 2. Open the law you want (e.g. Civil Code)
 * 3. Ctrl+A → Ctrl+C to copy all text
 * 4. Paste into a .txt file
 * 5. Run: node import-manual.js --file civil_code.txt --code "Civil Code" --jurisdiction UZ
 */

import pg from 'pg'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const args = process.argv.slice(2)
const fileArg = args.indexOf('--file')
const codeArg = args.indexOf('--code')
const jurisArg = args.indexOf('--jurisdiction')

const filePath = fileArg !== -1 ? args[fileArg + 1] : null
const codeName = codeArg !== -1 ? args[codeArg + 1] : 'Civil Code'
const jurisdiction = jurisArg !== -1 ? args[jurisArg + 1] : 'UZ'

function parseArticlesFromText(text) {
  const articles = []
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  let current = null
  let buffer = []

  for (const line of lines) {
    // Match "Статья 354", "Modda 354", "Article 354", "354-modda", "354-статья"
    const match = line.match(/^(?:Статья|Modda|Article|Моддa)\s+(\d+[\d.-]*)[\s.:\-]*(.*)$/i)
      || line.match(/^(\d+[\d.-]*)[.-]?(?:статья|modda|article)[\s.:\-]*(.*)$/i)

    if (match) {
      if (current && buffer.length > 0) {
        articles.push({ ...current, content: buffer.join(' ').replace(/\s+/g, ' ').trim() })
      }
      current = { article_number: match[1].trim(), title: match[2].trim() || null }
      buffer = []
    } else if (current && line.length > 15) {
      buffer.push(line)
    }
  }

  if (current && buffer.length > 0) {
    articles.push({ ...current, content: buffer.join(' ').replace(/\s+/g, ' ').trim() })
  }

  return articles
}

async function importFile(path, codeName, jurisdiction) {
  console.log(`Reading ${path}...`)
  const text = fs.readFileSync(path, 'utf8')
  const articles = parseArticlesFromText(text)
  console.log(`Parsed ${articles.length} articles from file`)

  let saved = 0
  for (const a of articles) {
    if (!a.content || a.content.length < 20) continue
    await pool.query(
      `INSERT INTO law_articles (jurisdiction, code_name, article_number, title, content, tags)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
      [jurisdiction, codeName, a.article_number, a.title, a.content, []]
    )
    saved++
  }
  console.log(`Saved ${saved} articles to database`)
}

// Built-in expanded dataset — real UZ law articles
const BUILT_IN = [
  // ═══ CIVIL CODE ═══
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '1', title: 'Relations regulated by civil legislation', content: 'Civil legislation determines the legal status of participants in civil transactions, the grounds for the emergence and procedure for the exercise of property rights and other real rights, regulates contractual and other obligations, as well as other property and personal non-property relations based on equality, autonomy of will and property independence of their participants.', tags: ['civil', 'general'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '8', title: 'Grounds for civil rights and obligations', content: 'Civil rights and obligations arise from the grounds provided by law, as well as from the actions of citizens and legal entities, which although not provided for by law, but due to the general principles and meaning of civil legislation give rise to civil rights and obligations.', tags: ['civil', 'obligations'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '14', title: 'Judicial protection of civil rights', content: 'Protection of violated or disputed civil rights shall be carried out by a court, arbitration court, or arbitration tribunal. Protection of civil rights in administrative procedure is carried out only in cases provided by law.', tags: ['civil', 'court', 'protection'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '22', title: 'Legal capacity of a citizen', content: 'The capacity to have civil rights and bear obligations (civil legal capacity) is recognized equally for all citizens. Legal capacity of a citizen arises at the moment of his birth and ceases at the time of death.', tags: ['civil', 'legal capacity', 'citizen'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '30', title: 'Guardianship and trusteeship', content: 'Guardianship is established over minors and citizens recognized by a court as legally incompetent due to mental disorder. Guardians are the legal representatives of their wards and perform all legally significant actions on their behalf and in their interests.', tags: ['civil', 'guardianship', 'minors'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '69', title: 'Legal entity', content: 'A legal entity is an organization that has separate property in ownership, economic management or operational management, is liable for its obligations with this property, may acquire and exercise property and personal non-property rights in its own name, bear obligations, be a plaintiff and defendant in court.', tags: ['civil', 'legal entity', 'company', 'organization'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '75', title: 'State registration of legal entities', content: 'A legal entity is subject to state registration in the manner prescribed by law. Data of state registration are included in the unified state register of legal entities. A legal entity is considered created from the moment of its state registration.', tags: ['civil', 'registration', 'legal entity', 'company'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '113', title: 'Limited liability company', content: 'A limited liability company is a business company founded by one or more persons, the authorized capital of which is divided into shares of the sizes determined by the constituent documents. Participants of a limited liability company are not liable for its obligations and bear the risk of losses associated with the activities of the company within the value of their contributions.', tags: ['LLC', 'company', 'liability', 'business formation'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '176', title: 'Concept of a transaction', content: 'Transactions are actions of citizens and legal entities aimed at establishing, changing or terminating civil rights and obligations. Transactions may be unilateral, bilateral or multilateral (agreements).', tags: ['transaction', 'contract', 'civil'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '177', title: 'Oral and written forms of transactions', content: 'A transaction for which a written form is not established by law or agreement of the parties may be concluded orally. A transaction that can be executed at the very moment of its execution may be concluded orally regardless of the form in which it should be completed.', tags: ['transaction', 'contract', 'written form', 'oral'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '178', title: 'Written form of transactions', content: 'A transaction must be made in writing if it is concluded between legal entities; between legal entities and citizens; between citizens, if its amount exceeds ten times the minimum wage established by law, and in cases provided by law regardless of the amount of the transaction.', tags: ['transaction', 'written form', 'contract'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '183', title: 'Void and voidable transactions', content: 'A transaction that does not meet the requirements of the law or other legal acts is void unless the law establishes that such a transaction is voidable or does not provide for other consequences of the violation. A voidable transaction is invalid by virtue of its recognition as such by the court.', tags: ['void transaction', 'voidable', 'contract', 'invalid'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '354', title: 'Concept of a contract', content: 'A contract is an agreement between two or more persons on the establishment, modification or termination of civil rights and obligations. Rules on bilateral and multilateral transactions apply to contracts. General provisions on obligations apply to contracts, unless otherwise provided by the rules of this chapter and rules on certain types of contracts.', tags: ['contract', 'civil law', 'obligations'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '355', title: 'Freedom of contract', content: 'Citizens and legal entities are free to enter into a contract. Compulsion to enter into a contract is not allowed, except in cases where the obligation to enter into a contract is provided for by this Code, a law or a voluntarily assumed obligation. The parties may conclude a contract both provided and not provided for by law or other legal acts.', tags: ['contract', 'freedom', 'civil law'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '358', title: 'Execution of a contract', content: 'A contract is concluded by sending an offer (proposal to conclude a contract) by one party and its acceptance by the other party. A contract is recognized as concluded at the moment of receipt of acceptance by the person who sent the offer.', tags: ['contract', 'offer', 'acceptance', 'execution'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '367', title: 'Price in the contract', content: 'Execution of a contract is paid for at the price established by agreement of the parties. In cases provided for by law, prices (tariffs, rates, rates, etc.) established or regulated by authorized state bodies and local authorities shall be applied.', tags: ['contract', 'price', 'payment'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '386', title: 'Penalty (fine, forfeit)', content: 'A penalty (fine, forfeit) is a sum of money determined by law or contract which the debtor is obliged to pay to the creditor in case of non-performance or improper performance of an obligation, in particular in case of delay in performance. At the request of payment of a penalty, the creditor is not obliged to prove the infliction of losses to him.', tags: ['penalty', 'fine', 'forfeit', 'contract breach'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '395', title: 'Grounds for liability for breach of obligation', content: 'A person who has not fulfilled an obligation or has fulfilled it improperly bears liability in the presence of guilt (intent or negligence), except in cases where the law or contract provides for other grounds of liability. A person is recognized as not guilty if, when exercising due care and diligence, it took all measures necessary for the proper fulfillment of the obligation.', tags: ['liability', 'obligation', 'breach', 'guilt'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '450', title: 'Modification and termination of contract', content: 'Modification and termination of a contract is possible by agreement of the parties, unless otherwise provided by this Code, other laws or contract. At the request of one party, the contract may be amended or terminated by court decision only upon material breach of the contract by the other party, and in other cases provided for by this Code, other laws or contract.', tags: ['contract', 'termination', 'modification', 'breach'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '454', title: 'Sale and purchase contract', content: 'Under a sale and purchase contract, one party (the seller) undertakes to transfer ownership of a thing (goods) to the other party (the buyer), and the buyer undertakes to accept this goods and pay a certain sum of money (price) for it.', tags: ['sale', 'purchase', 'contract', 'goods'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '536', title: 'Lease contract', content: 'Under a lease agreement, the lessor undertakes to provide the tenant with property for a fee for temporary possession and use or for temporary use. The products, fruits and income received by the tenant as a result of the use of the leased property in accordance with the contract are his property.', tags: ['lease', 'rent', 'contract', 'property'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '703', title: 'Contract for services', content: 'Under a contract for the provision of services for compensation, the contractor undertakes, on the instructions of the customer, to provide services (perform certain actions or carry out certain activities), and the customer undertakes to pay for these services.', tags: ['services', 'contract', 'compensation', 'B2B'] },
  { jurisdiction: 'UZ', code_name: 'Civil Code', article_number: '756', title: 'Loan contract', content: 'Under a loan agreement, one party (the lender) transfers ownership of money or other things determined by generic characteristics to the other party (the borrower), and the borrower undertakes to return to the lender the same sum of money (loan amount) or an equal number of other things of the same kind and quality received by him.', tags: ['loan', 'borrower', 'lender', 'money'] },

  // ═══ LABOR CODE ═══
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '1', title: 'Scope of the Labor Code', content: 'This Code regulates labor relations in enterprises, institutions, organizations, farms, as well as in other employers. The legislation on labor consists of this Code and other legislative acts of the Republic of Uzbekistan issued in accordance with it.', tags: ['labor', 'employment', 'general'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '6', title: 'Prohibition of forced labor', content: 'Forced labor is prohibited. Forced labor is work performed under threat of any penalty, including as a means of maintaining labor discipline, as a punishment for expressing political views, as a means of discrimination.', tags: ['labor', 'forced labor', 'prohibited', 'discrimination'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '18', title: 'Equal rights in labor', content: 'All citizens of the Republic of Uzbekistan have equal opportunities to exercise their labor rights. Restrictions in labor rights or advantages depending on sex, race, nationality, language, religion, social origin, property and official status, place of residence are not allowed.', tags: ['labor', 'equality', 'discrimination', 'rights'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '80', title: 'Employment contract (concept)', content: 'An employment contract is an agreement between an employee and an employer, according to which the employee undertakes to perform work in a certain specialty, qualification or position with submission to the internal labor regulations, and the employer undertakes to pay the employee wages and ensure working conditions provided for by labor legislation, collective agreement and agreement of the parties.', tags: ['employment', 'labor', 'contract', 'worker rights'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '81', title: 'Parties to employment contract', content: 'The parties to an employment contract are the employee and the employer. An employee is an individual who has entered into an employment contract with an employer. An employer is an enterprise, institution, organization, farm, as well as another employer.', tags: ['labor', 'employment', 'employer', 'employee'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '82', title: 'Conditions of employment contract', content: 'An employment contract is concluded in writing. The employment contract specifies: the place of work; the labor function of the employee; the date of commencement of work; the amount of wages; the rights and obligations of the employee and employer.', tags: ['employment contract', 'labor', 'written', 'conditions'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '87', title: 'Probationary period', content: 'By agreement of the parties, a probationary period may be established for the employee when concluding an employment contract in order to verify the employee\'s compliance with the assigned work. The probationary period, unless otherwise provided by law, cannot exceed three months.', tags: ['probation', 'employment', 'labor', 'trial period'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '97', title: 'Grounds for termination of employment contract', content: 'The employment contract is terminated on the grounds provided for by this Code. The grounds for termination of an employment contract are: agreement of the parties; expiration of the employment contract; initiative of the employee; initiative of the employer; circumstances beyond the control of the parties.', tags: ['termination', 'employment', 'dismissal', 'labor'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '100', title: 'Normal working hours', content: 'Normal working hours cannot exceed 40 hours per week. For employees under 18 years of age, employees engaged in hazardous work, and other categories of employees defined by law, reduced working hours are established. The employer is obliged to keep records of the time actually worked by each employee.', tags: ['labor', 'working hours', 'employee rights', '40 hours'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '106', title: 'Overtime work', content: 'Overtime work is work performed by an employee at the initiative of the employer outside the established working hours. Overtime work is allowed only with the written consent of the employee, except in cases of emergency. Overtime work should not exceed 4 hours within two consecutive days and 120 hours per year.', tags: ['overtime', 'labor', 'working hours', 'compensation'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '134', title: 'Annual basic leave', content: 'Employees are granted annual basic paid leave with preservation of the place of work (position) and average earnings. The duration of annual basic leave is not less than 15 working days. For certain categories of employees, the legislation provides for extended annual basic leave.', tags: ['leave', 'vacation', 'annual leave', 'labor rights'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '153', title: 'Minimum wage', content: 'The employer is obliged to pay the employee a wage not lower than the minimum wage established by law. The minimum wage is the lower limit of wages for unskilled labor performed under normal working conditions while working full-time, performing simple work.', tags: ['minimum wage', 'salary', 'labor', 'compensation'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '173', title: 'Employer liability for delayed wages', content: 'In case of delay in payment of wages, the employer is obliged to pay the employee a penalty in the amount established by the collective or labor agreement, but not less than the refinancing rate of the Central Bank for each day of delay, starting from the day following the established payment deadline.', tags: ['wages', 'delay', 'penalty', 'employer liability'] },
  { jurisdiction: 'UZ', code_name: 'Labor Code', article_number: '182', title: 'Labor safety obligations of employer', content: 'The employer is obliged to ensure safe working conditions for employees, comply with labor protection legislation, carry out certification of workplaces, conduct induction and regular briefings on labor safety, provide employees with protective equipment.', tags: ['labor safety', 'employer obligations', 'workplace', 'health'] },

  // ═══ TAX CODE ═══
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '1', title: 'Relations regulated by Tax Code', content: 'This Code establishes the principles of taxation, regulates relations connected with the establishment, introduction and collection of taxes in the Republic of Uzbekistan, as well as relations arising in the process of exercising tax control, challenging acts of tax authorities, and bringing to responsibility for committing a tax offense.', tags: ['tax', 'general', 'taxation principles'] },
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '13', title: 'Taxpayers', content: 'Taxpayers are organizations and individuals who are obligated by this Code to pay the corresponding taxes. Taxpayers have the right to: receive information from tax authorities about applicable taxes; use tax benefits; get a deferral or installment plan for tax payment in the prescribed manner.', tags: ['tax', 'taxpayer', 'obligations', 'rights'] },
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '24', title: 'Tax control', content: 'Tax control is the activity of tax authorities to monitor compliance with tax legislation, the correctness of calculation, completeness and timeliness of taxes payment. Tax control is carried out through tax audits, obtaining explanations from taxpayers, verification of accounting and reporting data.', tags: ['tax control', 'audit', 'tax authority', 'compliance'] },
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '198', title: 'Corporate income tax', content: 'Legal entities that are residents of the Republic of Uzbekistan pay corporate income tax on profits received from sources in Uzbekistan and abroad. Non-resident legal entities pay corporate income tax on profits received from sources in the Republic of Uzbekistan.', tags: ['income tax', 'corporate', 'profit', 'legal entity'] },
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '204', title: 'VAT taxable objects', content: 'The object of taxation by value added tax is the turnover on the sale of goods (works, services) on the territory of the Republic of Uzbekistan, as well as the import of goods into the territory of the Republic of Uzbekistan. VAT payers are legal entities and individual entrepreneurs registered for VAT.', tags: ['tax', 'VAT', 'business', 'goods', 'services'] },
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '237', title: 'Personal income tax', content: 'The objects of personal income tax are income received by a taxpayer from sources in Uzbekistan and abroad for residents, and from sources in Uzbekistan for non-residents. Income from employment, business, and passive sources (dividends, interest, royalties) are all taxable.', tags: ['personal income tax', 'individual', 'salary', 'income'] },
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '275', title: 'Tax on property of legal entities', content: 'Payers of the tax on property of legal entities are legal entities having objects of taxation. Objects of taxation are fixed assets, intangible assets, and other property of legal entities as of January 1 of the reporting year, reflected in accounting records.', tags: ['property tax', 'legal entity', 'assets', 'fixed assets'] },
  { jurisdiction: 'UZ', code_name: 'Tax Code', article_number: '340', title: 'Tax violations and penalties', content: 'Failure to submit tax reports within the established timeframe entails a fine of 1 percent of the tax amount due for each month of delay, but not more than 50 percent of this amount. Concealment or understatement of taxable base entails a fine of 20 percent of the understated tax amount.', tags: ['tax violation', 'penalty', 'fine', 'late filing'] },

  // ═══ CONSUMER RIGHTS ═══
  { jurisdiction: 'UZ', code_name: 'Law on Protection of Consumer Rights', article_number: '3', title: 'Consumer rights', content: 'The consumer has the right to: purchase goods of proper quality; safety of goods; information about goods and their manufacturers; compensation for damage caused by goods of inadequate quality; appeal to court and other authorized bodies for protection of violated rights.', tags: ['consumer rights', 'protection', 'quality', 'safety'] },
  { jurisdiction: 'UZ', code_name: 'Law on Protection of Consumer Rights', article_number: '14', title: 'Right to safe goods', content: 'The consumer has the right to the fact that the goods (work, service) under normal conditions of their use, storage, transportation and disposal were safe for his life and health, environment, as well as did not cause harm to his property. Requirements ensuring the safety of goods (works, services) are mandatory and established by law.', tags: ['consumer rights', 'safety', 'goods', 'protection'] },
  { jurisdiction: 'UZ', code_name: 'Law on Protection of Consumer Rights', article_number: '18', title: 'Consequences of sale of goods of improper quality', content: 'If defects are found in the goods, the consumer has the right to demand: replacement of the goods with a product of proper quality; proportional reduction of the purchase price; immediate free elimination of defects; refund of the amount paid for the goods.', tags: ['consumer rights', 'defect', 'refund', 'replacement', 'quality'] },

  // ═══ COMPANY LAW ═══
  { jurisdiction: 'UZ', code_name: 'Law on Joint-Stock Companies', article_number: '3', title: 'Concept of joint-stock company', content: 'A joint-stock company is a business company whose authorized capital is divided into a certain number of shares certifying the obligatory rights of the shareholders in relation to the joint-stock company. Shareholders are not liable for the obligations of the company and bear the risk of losses in connection with its activities within the value of the shares they own.', tags: ['JSC', 'joint-stock', 'company', 'shares', 'shareholders'] },
  { jurisdiction: 'UZ', code_name: 'Law on Joint-Stock Companies', article_number: '15', title: 'Authorized capital of joint-stock company', content: 'The authorized capital of the company is made up of the nominal value of the company\'s shares acquired by shareholders. The minimum size of the authorized capital of an open joint-stock company must be at least 400 million soums, and of a closed joint-stock company at least 100 million soums.', tags: ['JSC', 'authorized capital', 'shares', 'minimum capital'] },
]

async function importBuiltIn() {
  console.log(`Importing ${BUILT_IN.length} built-in law articles...`)
  let saved = 0
  for (const a of BUILT_IN) {
    await pool.query(
      `INSERT INTO law_articles (jurisdiction, code_name, article_number, title, content, tags)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
      [a.jurisdiction, a.code_name, a.article_number, a.title, a.content, a.tags]
    )
    saved++
  }
  console.log(`Done. Saved ${saved} articles.`)
}

async function main() {
  if (filePath) {
    await importFile(filePath, codeName, jurisdiction)
  } else {
    console.log('No --file provided. Importing built-in dataset...')
    await importBuiltIn()
  }
  await pool.end()
}

main().catch(console.error)
