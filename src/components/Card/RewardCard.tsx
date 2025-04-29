import React from 'react';
import styled from 'styled-components';
import { H4, Text } from '../Typography';
import { tokens } from '../../styles/tokens';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface RewardCardProps {
  title: string;
  points: number;
  progress: number;
  totalPoints: number;
  isUnlocked?: boolean;
}

const CardContainer = styled.div<{ $unlocked?: boolean }>`
  background: ${({ $unlocked }) =>
    $unlocked ? tokens.colors.cardBackground : 'transparent'};
  border: ${({ $unlocked }) =>
    !$unlocked ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
  border-radius: ${tokens.borderRadius.large};
  min-width: 311px;
  width: 311px;
  height: 167px;
  flex: 0 0 311px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px;
  opacity: ${({ $unlocked }) => ($unlocked ? 1 : 0.7)};
  transition: opacity 0.2s ease;
  box-sizing: border-box;

  &:hover {
    opacity: 1;
  }
`;

const UnlockedBadge = styled.div`
  background: var(--gradient-rewards);
  padding: 4px 8px;
  border-radius: ${tokens.borderRadius.pill};
  width: fit-content;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const LockedBadge = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: ${tokens.borderRadius.pill};
  width: fit-content;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const Title = styled(H4)`
  color: ${tokens.colors.textPrimary};
  font-size: ${tokens.typography.sizes.h4};
  line-height: ${tokens.typography.lineHeight.h4};
  margin-bottom: ${tokens.spacing.space2};
`;

const PointsCaption = styled(Text)`
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.typography.sizes.small};
  line-height: ${tokens.typography.lineHeight.small};
  margin-bottom: ${tokens.spacing.space2};
`;

const UnlockText = styled(Text)`
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.typography.sizes.small};
  line-height: ${tokens.typography.lineHeight.small};
  margin-bottom: ${tokens.spacing.space2};
`;

const ProgressContainer = styled.div`
  margin-top: auto;
  margin-bottom: ${tokens.spacing.space4};
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background: var(--gradient-rewards);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const ProgressText = styled(Text)`
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.typography.sizes.small};
  line-height: ${tokens.typography.lineHeight.small};
  white-space: nowrap;
`;

const StarWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

export const RewardCard: React.FC<RewardCardProps> = ({
  title,
  points,
  progress,
  totalPoints,
  isUnlocked = false,
}: RewardCardProps) => {
  const progressPercentage = (progress / totalPoints) * 100;
  const remainingPoints = totalPoints - progress;

  return (
    <CardContainer $unlocked={isUnlocked}>
      <StarWrapper>
        {isUnlocked ? (
          <StarIcon
            sx={{ width: 28, height: 28, color: 'var(--gradient-start)' }}
          />
        ) : (
          <StarBorderIcon
            sx={{ width: 28, height: 28, color: 'rgba(255, 255, 255, 0.5)' }}
          />
        )}
      </StarWrapper>
      {isUnlocked ? (
        <UnlockedBadge>
          <Text variant="tiny" weight="bold">
            Unlocked!
          </Text>
        </UnlockedBadge>
      ) : (
        <LockedBadge>
          <Text variant="tiny" weight="bold">
            Locked
          </Text>
        </LockedBadge>
      )}
      <Title>{title}</Title>
      {isUnlocked ? (
        <PointsCaption>{points} Points</PointsCaption>
      ) : (
        <UnlockText>Get {remainingPoints} more points to unlock</UnlockText>
      )}
      <ProgressContainer>
        <ProgressBar>
          <ProgressTrack>
            <ProgressFill $progress={progressPercentage} />
          </ProgressTrack>
          <ProgressText>
            {progress}/{totalPoints}pts
          </ProgressText>
        </ProgressBar>
      </ProgressContainer>
    </CardContainer>
  );
};
