import styled from 'styled-components';
import { tokens } from '../../styles/tokens';
import { Text } from '../Typography';
import React from 'react';

const baseCardStyles = `
  border-radius: ${tokens.borderRadius.large};
  padding: ${tokens.spacing.space2};
`;

interface CardProps {
  className?: string;
}

interface RewardCardProps extends CardProps {
  $unlocked?: boolean;
}

export const OrderCard = styled.div<CardProps>`
  background-color: ${tokens.colors.orderCard};
  color: ${tokens.colors.darkTextPrimary};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 167.5px;
  height: 114px;
  padding: 16px;
  border-radius: ${tokens.borderRadius.large};

  @media (min-width: ${tokens.breakpoints.tablet}) {
    width: 311px;
    height: 180px;
  }

  p {
    color: ${tokens.colors.darkTextPrimary};
  }

  p[data-color='secondary'] {
    color: ${tokens.colors.darkTextSecondary};
  }

  .order-count {
    position: absolute;
    top: ${tokens.spacing.space1};
    right: ${tokens.spacing.space1};
    width: 24px;
    height: 24px;
    background-color: ${tokens.colors.orderCountBg};
    color: ${tokens.colors.darkTextPrimary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${tokens.typography.sizes.small};
    font-weight: ${tokens.typography.weights.bold};
  }

  .order-info {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .view-order {
    margin-top: auto;
    text-decoration: underline;
    color: ${tokens.colors.darkTextPrimary};
    font-weight: ${tokens.typography.weights.bold};
    font-size: ${tokens.typography.sizes.small};
    cursor: pointer;
    align-self: flex-start;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const ItemCard = styled.div<CardProps>`
  background-color: ${tokens.colors.cardBackground};
  color: ${tokens.colors.textPrimary};
  overflow: hidden;
  width: 168px;
  height: 194px;
  flex: 0 0 168px;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-radius: ${tokens.borderRadius.large};

  @media (min-width: ${tokens.breakpoints.tablet}) {
    width: 240px;
    height: 280px;
  }

  .image-container {
    width: 100%;
    height: 50%;
    position: relative;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    height: 50%;
    padding: ${tokens.spacing.space2};
    display: flex;
    flex-direction: column;
    gap: ${tokens.spacing.space1};
    justify-content: center;
  }

  .content .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ActionCard = styled.div<CardProps>`
  ${baseCardStyles}
  background-color: ${tokens.colors.cardBackground};
  color: ${tokens.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.space2};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  .icon {
    width: 24px;
    height: 24px;
  }
`;

export const RewardCard = styled.div<RewardCardProps>`
  ${baseCardStyles}
  background: ${tokens.colors.gradient.start};
  background: linear-gradient(
    90deg,
    ${tokens.colors.gradient.start} 0%,
    ${tokens.colors.gradient.middle} 50%,
    ${tokens.colors.gradient.end} 100%
  );
  color: ${tokens.colors.textPrimary};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.space2};
  opacity: ${({ $unlocked = false }) => ($unlocked ? 1 : 0.7)};
  transition: opacity 0.2s ease;
  width: 311px;
  max-width: 311px;
  flex: 0 0 auto;

  &:hover {
    opacity: 1;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: ${tokens.borderRadius.pill};
    overflow: hidden;

    .progress {
      height: 100%;
      background-color: ${tokens.colors.textPrimary};
      transition: width 0.3s ease;
    }
  }
`;

// ActionButton component
interface ActionButtonProps {
  icon: React.ReactNode;
  header: string;
  description: string;
  onClick?: () => void;
  rightIcon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  header,
  description,
  onClick,
  rightIcon,
}) => (
  <button
    style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      background: 'var(--color-card-bg)',
      border: 'none',
      borderRadius: 'var(--radius-large)',
      padding: '16px',
      cursor: 'pointer',
      gap: '16px',
      margin: 0,
      outline: 'none',
      justifyContent: 'space-between',
    }}
    onClick={onClick}
  >
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
      }}
    >
      {icon}
    </span>
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        flex: 1,
        minWidth: 0,
      }}
    >
      <Text weight="bold" style={{ color: 'white' }}>
        {header}
      </Text>
      <Text variant="small" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </Text>
    </span>
    {rightIcon && (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '16px',
        }}
      >
        {rightIcon}
      </span>
    )}
  </button>
);
