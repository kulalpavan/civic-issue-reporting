# Login Credentials for Civic Issue Reporting System

## Available User Accounts

### Citizen Account
- **Username:** `citizen1`
- **Password:** `password123`
- **Role:** `citizen`
- **Purpose:** Regular users who can report issues

### Officer Account
- **Username:** `officer1`
- **Password:** `officer123`
- **Role:** `officer`
- **Purpose:** Government officers who can manage and respond to issues

### Admin Account
- **Username:** `admin1`
- **Password:** `admin123`
- **Role:** `admin`
- **Purpose:** System administrators with full access

## API Endpoints

### Login
- **URL:** `POST /api/users/login`
- **Body:**
  ```json
  {
    "username": "citizen1",
    "password": "password123",
    "role": "citizen"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "1",
      "username": "citizen1", 
      "role": "citizen"
    }
  }
  ```

## Common Login Errors Fixed

1. **"Server error. Please try again later."**
   - **Cause:** Missing `JWT_SECRET` environment variable
   - **Fix:** Added `JWT_SECRET` to `.env` file

2. **"Invalid credentials"**
   - **Cause:** Incorrect password or username/role combination
   - **Fix:** Updated user passwords with known values

3. **Connection refused**
   - **Cause:** Server not running on expected port
   - **Fix:** Ensure server is running on port 5000

## Testing

Run the test files to verify login functionality:
```bash
node test-login.js          # Test single login
node test-all-logins.js     # Test all user accounts
```