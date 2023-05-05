const fs = require('fs');
const readline = require('readline');
const { exit } = require('process');

function readEmailsFromFile(filename) {
    return new Promise((resolve) => {
        const emailSet = new Set();
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

        const rl = readline.createInterface({
            input: fs.createReadStream(filename),
            crlfDelay: Infinity,
        });

        rl.on('line', (line) => {
            const emails = line.match(emailPattern);
            if (emails) {
                emails.forEach((email) => emailSet.add(email));
            }
        });

        rl.on('close', () => {
            resolve(emailSet);
        });
    });
}

async function compareEmails(file1, file2) {
    const emails1 = await readEmailsFromFile(file1);
    const emails2 = await readEmailsFromFile(file2);

    const commonEmails = new Set([...emails1].filter((email) => emails2.has(email)));
    return commonEmails;
}

async function main() {
    const file1 = 'file1.txt';
    const file2 = 'file2.txt';

    const commonEmails = await compareEmails(file1, file2);

    const hitsFile = 'hits.txt';
    fs.writeFileSync(hitsFile, '');

    console.log('Common email addresses in both files:');
    for (const email of commonEmails) {
        console.log(email);
        fs.appendFileSync(hitsFile, `${email}\n`);
    }
}

main().catch((err) => {
    console.error('An error occurred:', err);
    exit(1);
});
