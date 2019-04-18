import React from 'react';
import styled from 'styled-components';

const HeartWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  transform: rotate(45deg);
  transform-origin: 32px 32px;
`;

const Heart = styled.div`
  top: 23px;
  left: 19px;
  position: absolute;
  width: 26px;
  height: 26px;
  background: ${({ theme }) => theme.compAccent};
  &:after,
  &:before {
    content: ' ';
    position: absolute;
    display: block;
    width: 26px;
    height: 26px;
    background: ${({ theme }) => theme.compAccent};
  }
  &:before {
    left: -17px;
    border-radius: 50% 0 0 50%;
  }
  &:after {
    top: -17px;
    border-radius: 50% 50% 0 0;
  }
`;

export default () => (
  <HeartWrapper>
    <Heart />
  </HeartWrapper>
);
