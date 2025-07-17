import React from 'react';
import { useNavigate } from 'react-router-dom';
import CalmRoom from '../components/CalmRoom';

const CalmRoomPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return <CalmRoom onBack={handleBack} />;
};

export default CalmRoomPage;