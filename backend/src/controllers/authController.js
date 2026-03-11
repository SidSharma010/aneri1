import jwt from 'jsonwebtoken';

export async function loginWithOtp(req, res) {
  const { phone } = req.body;
  // OTP verification should be delegated to Firebase/OTP provider.
  const mockUser = {
    id: 'usr_mock_1',
    role: 'sender',
    phone
  };
  const token = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: mockUser });
}
