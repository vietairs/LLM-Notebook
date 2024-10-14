import { test } from 'vitest';
import App from '../src/App';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('displays correct text', () => {
  const { getByText } = render(<App />);
  const textElement = getByText('Hello, World!');
  expect(textElement).toBeInTheDocument();
});

test('increments count on button click', () => {
  const { getByText } = render(<App />);
  const buttonElement = getByText('Click me');
  fireEvent.click(buttonElement);
  const countElement = getByText('Count: 1');
  expect(countElement).toBeInTheDocument();
});