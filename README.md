# Phase Timeline Challenge

## Overview

Implement interactive features for a Timeline component. We will provide a basic Timeline component scaffold, and your task is to implement the functionality that meets the user behavior requirements outlined below.

![component-overview](./readme-assets/component-overview.jpg)

## Glossary

- **Timeline**: The main component that visually represents the duration of a sequence of events or changes over time.
- **Playhead**: The visual indicator that shows the current time position on the Timeline.
- **Current Time**: The specific time point indicated by the Playhead's position.
- **Duration**: The total length of time represented by the Timeline.
- **Ruler**: The component showing time measurements and increments along the Timeline.
- **Track**: A horizontal lane on the Timeline that can contain multiple Keyframes, often used to group related events or changes.
- **Track List**: The component that displays and manages multiple Tracks.
- **Keyframe**: A marked point on the Timeline representing a significant event, change, or state.
- **Keyframe List**: The component that shows the Keyframes across all Tracks, synchronized with the Ruler.
- **Segment**: The visual representation of the Timeline's duration in the Keyframe List.

## User Behavior Requirements

### 1. Number Input Field

#### Interface

| Prop       | Type               | Description                                      |
| ---------- | ------------------ | ------------------------------------------------ |
| `value`    | `number`           | The current value of the input field             |
| `onChange` | `(number) => void` | The callback to be called when the value changes |

#### Behavior

<!-- TODO: add screen recording here to show user behavior -->

<video controls src="./readme-assets/01-input.mp4"></video>

- [ ] The displayed value updates immediately while typing, but `onChange` is not triggered until input is confirmed
- [ ] Clicking outside the input field removes focus and changes the value
- [ ] Clicking on the native step buttons immediately changes the value
- [ ] Pressing up arrow or down arrow keys immediately changes the value
- [ ] Entire text is selected when the input field gains focus
- [ ] Entire text is selected after using the native step buttons
- [ ] Entire text is selected after using the up arrow or down arrow keys
- [ ] Pressing Enter confirms the new value and removes focus
- [ ] Pressing Escape reverts to the original value and removes focus
- [ ] Leading zeros are automatically removed
- [ ] Negative values are automatically adjusted to the minimum allowed value
- [ ] Decimal values are automatically rounded to the nearest integer
- [ ] Invalid inputs (non-numeric) revert to the previous valid value

### 2. Play Controls Behavior

<video controls src="./readme-assets/02-play-controls.mp4"></video>

- [ ] Current Time is always between `0ms` and the Duration
- [ ] Current Time adjusts if it exceeds the newly set Duration
- [ ] Duration is always between `100ms` and `6000ms`
- [ ] Current Time and Duration are always multiples of `10ms`
- [ ] Current Time and Duration are always positive integers
- [ ] Playhead position updates only after specific actions on Current Time input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 3. Ruler Behavior

<video controls src="./readme-assets/03-ruler.mp4"></video>

- [ ] Clicking or dragging on the Ruler updates the Current Time and Playhead position
- [ ] Horizontal scrolling of the Ruler is synchronized with the Keyframe List
- [ ] Ruler length visually represents the total Duration (`1ms = 1px`)
- [ ] Ruler length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 4. Track List Behavior

<video controls src="./readme-assets/04-track-list.mp4"></video>

- [ ] Vertical scrolling of the Track List is synchronized with the Keyframe List

### 5. Keyframe List Behavior

<video controls src="./readme-assets/05-keyframe-list.mp4"></video>

- [ ] Vertical scrolling is synchronized with the Track List
- [ ] Horizontal scrolling is synchronized with the Ruler
- [ ] Segment length visually represents the total Duration (`1ms = 1px`)
- [ ] Segment length updates only after specific actions on Duration input (losing focus, pressing Enter, using arrow keys, or clicking up/down buttons)

### 6. Playhead Behavior

<video controls src="./readme-assets/06-playhead.mp4"></video>

- [ ] Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling
- [ ] Playhead maintains its relative position during horizontal scrolling
- [ ] Playhead is visible only when within the Timeline's visible area, using the `hidden` attribute when completely out of view

## Implementation Guidelines

- Implement the required behaviors in the appropriate child components of the provided Timeline
- Write comprehensive tests to ensure that the implementation meets the user behavior requirements, including edge cases
- Consider performance implications, such as minimizing unnecessary re-renders
- Pay attention to user experience and interface design
- Write clean, well-documented, and maintainable code

## Submission

- Share your code repository (GitHub or GitLab) containing the implemented solution
- Ensure the repository includes all necessary code, tests, and documentation
- Provide any additional setup or running instructions in the repository's README file
- Be prepared to answer follow-up questions about your implementation if requested

Good luck with the Phase Timeline Challenge!
