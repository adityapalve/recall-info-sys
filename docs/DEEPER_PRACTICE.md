# Deeper practice: feature direction

This note records possible changes to session flow and question depth. No app behavior is changed on this branch yet.

## What the app does today

- `buildSession` chooses due cards first, then unseen cards in curriculum order. The content starts with Arrays & Hashing, so early sessions naturally contain many hash map and set problems.
- The answer options are shuffled. The order of the questions in a session is not.
- Session size and the daily new-card cap are separate. The default session size is 20, but the default cap is 10 new cards per day. On a new account, a first session therefore has at most 10 cards; finishing those makes the start button inactive until a review is due or the next day's new-card budget begins.
- A missed question can reappear at the back of the same session (`maxRetries` defaults to 2). A completed question cannot currently be opened as an immediate practice round without affecting its spaced-repetition schedule.
- Content has a free-text complexity explanation per problem, shown after answering. It has no structured complexity question or alternate-approach answers yet.

## Recommended flow

1. Make 10 cards the default session size. Keep the size selector available, but show the actual number that can start.
2. Keep a separate daily new-card budget, with a clear setting and on-screen remaining count. If the intended flow is two fresh sets of 10 in one day, use a 20-new-card daily budget. The session size alone cannot enable the second set.
3. At session end, offer **Next 10** when due or unseen cards remain. When none remain, offer **Practice again**. Practice again should quiz previously seen cards without moving their due dates or consuming the daily new-card budget. Show a short explanation that this round is extra practice.
4. Mix problems across families within a session while preserving a gentle curriculum: choose from an unlocked pool of nearby new cards, then balance families and avoid long runs of the same primary pattern. Keep due-card priority. Seed the order per session so it stays stable if resumed.
5. Add a second question stage for selected problems: after choosing a pattern, ask for the best time complexity, then later compare that with one plausible alternative approach. Store the canonical approach, constraints, time, space, and distractor explanations as structured content. Each stage should have its own scheduling identity so a correct pattern answer does not imply mastery of complexity.

## Product decisions to settle before implementation

- Whether the default daily new-card budget should rise from 10 to 20, or remain at 10 while the second session draws from due/practice cards.
- Whether Practice again should use the last session's cards, missed cards only, or a user-selected set. A sensible first version is the last session's cards.
- Whether the complexity stage appears immediately after the pattern answer or as a separate card later. A separate card makes independent spaced repetition clearer; an immediate follow-up can make the learning flow feel connected.
- How broad the unlocked new-card pool should be. Fully random selection across all 150 problems may introduce advanced topics too early.

## Implementation sequence

1. Separate the two session limits in the UI and add Next 10 / Practice again states. Test that practice never writes FSRS scheduling changes or counts as a newly introduced card.
2. Introduce seeded, family-balanced selection for new cards. Test the variety and the curriculum boundary with fixed seeds.
3. Pilot structured complexity content and question generation on a small set of problems, including cases with valid alternate approaches. Validate answers against the stated approach and constraints before expanding to the full deck.

## Success checks

- A new learner can complete one set of 10 and start another when their daily budget allows.
- Finishing the daily budget still leaves an explicit, usable practice option.
- Repeating a practice round does not advance or postpone scheduled reviews.
- Early sessions contain a reasonable mix of patterns without showing material the learner has not reached.
- Complexity answers explain why each choice is right or wrong for the named approach.
