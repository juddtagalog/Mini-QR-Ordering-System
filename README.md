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

