Mini QR Ordering System
A QR based ordering website for a restaurant. Customers scan a QR code at their table to browse the menu and place orders. The staff will use the admin dashboard to view and manage incoming orders. 

Tech Stack
Frontend - React + Typescript, Tailwind CSS, React Router, Vite
Backend - PHP, MySQL, Custom MVC architecture with DTOs and router built in plain php
Prerequisities
PHP 8.0+
MySQL 5.7+
Node.js 18+
npm

Setup Instructions
1. Find your local ip address
you need your computer's local ip address so phones on the same wifi network can connect.
windows (powershell)
ipconfig
Mac/Linux (Bash)
ifconfig

then find IPv4 address
2. configure the IP address
Replace the 192.168.0.118 with your actual IP address in these three files

frontend/src/api/apiService.ts
const API_BASE_URL = 'http://192.168.0.118:8000/api';
replace 192.168.0.118 with your actual local ip address

frontend/src/pages/CustomerMenu.tsx
const qrUrl = `http://192.168.0.118:5173/?table=${encodeURIComponent(tableNumber)}`;
replace 192.168.0.118 with your actual local ip address

backend/config/Cors.php
$allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://192.168.0.118:5173', 
        ];
replace 192.168.0.118 with your actual ip address

3. Database setup
import the database schema and seed the data
Windows(powershell)
Get-Content backend/database/schema.sql -Raw | mysql -u root -p

Mac/Linux(bash)
mysql -u root -p < backend/database/schema.sql

4. Backend setup
Create a .env file in the backend/ directory copy from .env.example and configure your MySQL credentials
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mini_qr_db
DB_USER=root
DB_PASSWORD=your_password_here

5. Install frontend Dependencies
cd frontend
npm install

6. run the app
you will need two terminals
first will run the php backend server

Terminal 1
cd backend/public
php -S 0.0.0.0:8000 index.php

second you will need to run the frontend 
Terminal 2
cd frontend
npm run dev -- --host 

Accessing the app
on your computer you can view the customer menu on http://localhost:5173
and admin view on http://localhost:5173/admin

on your phone or tablet (has to be same wifi)
(assuming they are at the restaurant and scan the qr)

Customer menu at 192.168.0.118:5173/?table=
admin view at 192.168.0.118:5173/admin

Usage
Customer flow
1. Customer enters their table number or scans table qr code (table number prefilled)
2. Browse the menu
3. Click add on items opening cart drawer
4. adjust quantities or remove items in cart
5. click checkout and simulated payment happens
6. order confirmation with total amount due
7. order is sent and admin will have to refresh their view to check latest orders

admin flow
1. go to url/admin
2. view all incoming orders sorted by recency
3. update order status
4. click refresh to reload history

qr code flow
1. enter a table number on the customer page
2. click show table qr
3. scan generated qr
4. menu opens with table number pre filled

## License
Mit @ 2026 Judd Tagalog