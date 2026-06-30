import pool from './pool.js'
import dotenv from 'dotenv'
dotenv.config()

const articles = [
  {
    jurisdiction: 'UZ',
    code_name: 'Civil Code',
    article_number: '354',
    title: 'Concept of a contract',
    content: 'A contract is an agreement between two or more persons on the establishment, modification or termination of civil rights and obligations. Rules on bilateral and multilateral transactions apply to contracts. General provisions on obligations apply to contracts, unless otherwise provided by the rules of this chapter and rules on certain types of contracts.',
    tags: ['contract', 'civil law', 'obligations'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Civil Code',
    article_number: '355',
    title: 'Freedom of contract',
    content: 'Citizens and legal entities are free to enter into a contract. Compulsion to enter into a contract is not allowed, except in cases where the obligation to enter into a contract is provided for by this Code, a law or a voluntarily assumed obligation. The parties may conclude a contract, both provided and not provided for by law or other legal acts. The terms of the contract are determined at the discretion of the parties, except in cases where the content of the relevant condition is prescribed by law or other legal acts.',
    tags: ['contract', 'freedom', 'civil law'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Labor Code',
    article_number: '80',
    title: 'Employment contract',
    content: 'An employment contract is an agreement between an employee and an employer, according to which the employee undertakes to perform work in a certain specialty, qualification or position with submission to the internal labor regulations, and the employer undertakes to pay the employee wages and ensure working conditions provided for by labor legislation, collective agreement and agreement of the parties.',
    tags: ['employment', 'labor', 'contract', 'worker rights'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Labor Code',
    article_number: '100',
    title: 'Working hours',
    content: 'Normal working hours cannot exceed 40 hours per week. For employees under 18 years of age, employees engaged in hazardous work, and other categories of employees defined by law, reduced working hours are established. The employer is obliged to keep records of the time actually worked by each employee.',
    tags: ['labor', 'working hours', 'employee rights'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Tax Code',
    article_number: '204',
    title: 'VAT taxable objects',
    content: 'The object of taxation by value added tax is the turnover on the sale of goods (works, services) on the territory of the Republic of Uzbekistan, as well as the turnover on the transfer of goods (performance of work, provision of services) for own needs, the costs of which are not deductible when calculating income tax, as well as import of goods into the territory of the Republic of Uzbekistan.',
    tags: ['tax', 'VAT', 'business', 'taxation'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Civil Code',
    article_number: '113',
    title: 'Limited Liability Company',
    content: 'A limited liability company is a business company founded by one or more persons, the authorized capital of which is divided into shares of the sizes determined by the constituent documents. The participants of a limited liability company are not liable for its obligations and bear the risk of losses associated with the activities of the company, within the value of the contributions made by them.',
    tags: ['company', 'LLC', 'business formation', 'liability'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Civil Code',
    article_number: '386',
    title: 'Penalty (fine, forfeit)',
    content: 'A penalty (fine, forfeit) is a sum of money determined by law or contract which the debtor is obliged to pay to the creditor in case of non-performance or improper performance of an obligation, in particular in case of delay in performance. At the request of payment of a penalty, the creditor is not obliged to prove the infliction of losses to him.',
    tags: ['penalty', 'contract breach', 'fine', 'obligations'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Civil Code',
    article_number: '450',
    title: 'Modification and termination of contract',
    content: 'The modification and termination of a contract is possible by agreement of the parties, unless otherwise provided by this Code, other laws or contract. At the request of one of the parties, the contract may be amended or terminated by decision of the court only upon material breach of the contract by the other party, and in other cases provided for by this Code, other laws or contract. A material breach of a contract is recognized as a breach by one of the parties which causes such damage to the other party that it is substantially deprived of what it was entitled to count on when concluding the contract.',
    tags: ['contract', 'termination', 'modification', 'breach'],
  },
  {
    jurisdiction: 'KZ',
    code_name: 'Civil Code',
    article_number: '378',
    title: 'Concept and terms of the contract',
    content: 'A contract is an agreement of two or more persons on the establishment, modification or termination of civil rights and obligations. The terms of the contract are determined by the parties at their own discretion, except in cases where the relevant terms are prescribed by legislative acts.',
    tags: ['contract', 'civil law', 'Kazakhstan'],
  },
  {
    jurisdiction: 'UZ',
    code_name: 'Law on Protection of Consumer Rights',
    article_number: '14',
    title: 'Right to safe goods',
    content: 'The consumer has the right to the fact that the goods (work, service) under normal conditions of their use, storage, transportation and disposal were safe for his life and health, environment, as well as did not cause harm to his property. Requirements ensuring the safety of goods (works, services) are mandatory and are established by law.',
    tags: ['consumer rights', 'safety', 'goods', 'protection'],
  },
]

for (const article of articles) {
  await pool.query(
    `INSERT INTO law_articles (jurisdiction, code_name, article_number, title, content, tags)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT DO NOTHING`,
    [article.jurisdiction, article.code_name, article.article_number, article.title, article.content, article.tags]
  )
}

console.log(`✅ Seeded ${articles.length} law articles`)
await pool.end()
