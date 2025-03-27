import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StudentCreationForm from '@/app/(tabs)/addStudent';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('StudentCreationForm', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders form elements correctly', () => {
    const { getByPlaceholderText, getByText } = render(<StudentCreationForm />);

    expect(getByPlaceholderText('Enter full name')).toBeTruthy();
    expect(getByText('Register Student')).toBeTruthy();
  });

  it('shows an error message when submitting with an empty name', async () => {
    const { getByText, findByText } = render(<StudentCreationForm />);

    fireEvent.press(getByText('Register Student'));

    expect(await findByText('Please enter a name')).toBeTruthy();
  });
});
