import React from 'react';
import styled from 'styled-components';
import { H4, Text } from '../Typography';

interface RewardCardProps {
  title: string;
  points?: number;
  sales?: number;
  description?: string;
  children?: React.ReactNode;
}

const CardContainer = styled.div`
  background: var(--color-card-bg);
  border-radius: var(--radius-large);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 311px;
  max-width: 311px;
  flex: 0 0 auto;
`;

const HeaderText = styled(Text)`
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
`;

const PointsText = styled(H4)`
  background: var(--gradient-rewards);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const SalesText = styled(H4)`
  color: var(--color-text-primary);
  margin: 0;
`;

const DescriptionText = styled(Text)`
  color: var(--color-text-secondary);
`;

export const RewardCard: React.FC<RewardCardProps> = ({
  title,
  points,
  sales,
  description,
  children,
}) => {
  return (
    <CardContainer>
      <HeaderText>{title}</HeaderText>
      {points && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PointsText>{points}</PointsText>
          <Text variant="regular">Points</Text>
        </div>
      )}
      {sales && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SalesText>{sales}</SalesText>
          <Text variant="regular">Sales</Text>
        </div>
      )}
      {description && (
        <DescriptionText variant="regular">{description}</DescriptionText>
      )}
      {children}
    </CardContainer>
  );
};
