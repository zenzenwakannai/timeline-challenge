# Phase Timeline Challenge - Ryan Chen's Implementation

## Installation and Setup

After cloning the repository, run the following commands to install dependencies and run the development server:

Install dependencies:

```sh
yarn install
```

Start the development server:

```sh
yarn start
# Then, open http://localhost:3000 in your browser
```

Build for production:

```sh
yarn build
```

## Testing

This project uses Jest and Playwright for testing.

The functional requirements (from the original requirements) are in [`INSTRUCTIONS.md`](INSTRUCTIONS.md), with numbered headings that correspond directly to the test implementations.

### Jest (Unit Tests)

Simple component tests are written using Jest and are located in the corresponding `__tests__` folders.

I've also written unit tests for utility functions, which can be found in their respective `__tests__` folders.

To run the Jest tests:

```sh
yarn test
```

### Playwright (End-to-End Tests)

Playwright is used for testing scenarios that are difficult to test with JSDOM:

1. Browser behaviors that JSDOM cannot simulate, such as `<input type="number">` step buttons (shadow DOM)
2. Complex UI interactions like scrolling, dragging, and other user interactions

The end-to-end tests are located in the `e2e` folder.

To run the Playwright tests:

```sh
yarn playwright test
```

## Performance Optimizations

I've implemented several performance optimizations:

### React Performance Optimizations

- Using `useRef` instead of `useState` for state that doesn't need to trigger re-rendering
- Using `React.memo`, `useCallback`, and `useMemo` to prevent unnecessary re-renders

### Other Performance Optimizations

- Implementing scroll locking to prevent unnecessary processing with `isScrolling.current = true`
- Using `requestAnimationFrame` for smooth scroll position updates:

  ```typescript
  requestAnimationFrame(() => {
    if (keyframeListRef.current) {
      keyframeListRef.current.scrollLeft = scrollLeft;
    }
  });
  ```

- Applying `throttle` to `ResizeObserver` events
- Applying `will-change` property to give the browser hints for rendering optimization

## User Experience Enhancements

In addition to the requirements in [`INSTRUCTIONS.md`](INSTRUCTIONS.md), I've implemented several UX improvements:

- **Input Validation**: Real-time feedback with red indicators for invalid inputs in `NumberInput`
- **Input Handling**: Special handling for `<input type="number">` when entering letters (including `e/E`, which are normally allowed in number inputs) in `NumberInput`
- **Scroll Experience**: Preventing browser back-swipe at the beginning of the timeline
- **Accessibility**: Added ARIA labels to improve interactivity and screen reader support

## Additional Note: Requirement Interpretations

Some requirements in [`INSTRUCTIONS.md`](INSTRUCTIONS.md) were ambiguous, particularly regarding when certain validations should be applied. After reviewing the demo videos, I made implementation decisions based on my observations.

### Input Validation Timing

| Validation Type | Implementation Approach |
|-----------------|-------------------------|
| Leading zeros removal | Applied **after input commit** |
| Negative values adjustment | Applied **after input commit** |
| Decimal values rounding | Applied **after input commit** |
| Invalid input (alphabetical characters) handling | Applied **during input** |

If these interpretations are incorrect, please let me know.

## Additional Note: Native Step Button Handling

To the best of my knowledge, there's no straightforward way to detect when a user clicks the native step buttons in `<input type="number">`.

I considered several approaches:

1. Creating a custom UI component instead of using the native `<input type="number">`
2. Detecting interactions through mouse position analysis

Neither approach was ideal, so I implemented a workaround to detect native step button clicks:

```typescript
// src/components/Timeline/NumberInput.tsx: handleChange
if (!("inputType" in e.nativeEvent)) {
  onCommit(newValue);
  inputRef.current?.select();
}
```

The corresponding tests also use workarounds (see the `#1-3` test in `e2e/numberInput.spec.ts`).

This implementation is not perfect and can be improved in future iterations.
