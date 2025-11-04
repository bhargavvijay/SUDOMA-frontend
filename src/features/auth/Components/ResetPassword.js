import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordAsync, selectPasswordReset, selectError, resetError } from '../authSlice';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

function ResetPassword() {
  const { id } = useParams(); // Extract token from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const passwordReset = useSelector(selectPasswordReset);
  const error = useSelector(selectError);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(5); // Countdown for redirect

  useEffect(() => {
    if (passwordReset) {
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/login');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (error) dispatch(resetError());
    };
  }, [passwordReset, navigate, dispatch, error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    dispatch(resetPasswordAsync({ newPassword, id }));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h3 className="text-center mb-4">Reset Password</h3>

          {passwordReset && (
            <Alert variant="success">
              Password reset successfully! Redirecting to login in {redirectCountdown} seconds...
            </Alert>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!passwordReset && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNewPassword" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Reset Password
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;
