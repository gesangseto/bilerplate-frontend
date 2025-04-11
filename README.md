BUG:
Pada Komputer tertentu node_module tidak terinstall secara benar dan akan menghasilkan Website yang selalu "not respond" (Crash)
jalankan command berikut:
$ npm cache clean --force

Teruji dengan nvm dan info versi \*note(Harus menghapus node_modules dan package-lock.json):

1. Versi node 14.18.0, npm 6.15.14
2. Versi node 18.12.0, npm 8.19.2
