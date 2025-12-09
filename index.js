#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');

const file = 'tasks.json';

// Buat tasks.json kalau belum ada
if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
}

let tasks = JSON.parse(fs.readFileSync(file, 'utf8'));

async function main() {
    console.clear();
    console.log("=== TASK TRACKER ===\n");

    const answer = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Pilih aksi:',
        choices: ['Lihat Task', 'Tambah Task', 'Selesai Task', 'Keluar']
    }]);

    switch(answer.action) {
        case 'Lihat Task':
            console.log('\nDaftar Task:');
            if (tasks.length === 0) console.log("Belum ada task!");
            tasks.forEach((t, i) => console.log(`${i+1}. [${t.done ? 'x':' '}] ${t.name}`));
            break;

        case 'Tambah Task':
            const newTask = await inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'Nama task:'
            }]);
            tasks.push({name: newTask.name, done: false});
            fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
            console.log('Task ditambahkan!');
            break;

        case 'Selesai Task':
            if (tasks.length === 0) {
                console.log("Belum ada task!");
                break;
            }
            const choices = tasks.map((t,i) => ({name: t.name, value:i}));
            const doneTask = await inquirer.prompt([{
                type: 'list',
                name: 'index',
                message: 'Pilih task selesai:',
                choices
            }]);
            tasks[doneTask.index].done = true;
            fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
            console.log('Task selesai ditandai!');
            break;

        case 'Keluar':
            console.log("Bye!");
            process.exit();
    }

    await pause();
    main();
}

async function pause() {
    await inquirer.prompt([{
        type: 'input',
        name: 'pause',
        message: '\nTekan Enter untuk kembali ke menu...'
    }]);
}

main();
