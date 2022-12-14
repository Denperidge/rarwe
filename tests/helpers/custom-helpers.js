import { click, fillIn } from '@ember/test-helpers';

export function testSelector(name, psuedoClass = '') {
  let selector = `[data-test-rr="${name}"]`;
  if (psuedoClass != '') {
    selector += `${psuedoClass}`;
  }
  return selector;
}

export async function dataTestSteps(...args) {
  for (let i = 0; i < args.length; i += 2) {
    let func = args[i];
    let target = args[i + 1];
    let selector;
    if (target.startsWith('[')) {
      selector = target;
    } else {
      selector = testSelector(target);
    }

    // If no additional parameter
    if (typeof args[i + 2] === 'function') {
      await func(selector);
    }
    // If additional parameter
    else {
      await func(selector, args[i + 2]);
      i++; // Skip the additional parameter next step
    }
  }
}

export async function createBand(name) {
  return dataTestSteps(
    click,
    'new-band-button',
    fillIn,
    'new-band-name',
    name,
    click,
    'save-band-button'
  );
}

export async function createSong(title) {
  return dataTestSteps(
    click,
    'new-song-button',
    fillIn,
    'new-song-title',
    title,
    click,
    'save-song-button'
  );
}

export function starRatingCheck(
  assert,
  amountFull,
  amountEmpty,
  extraText = ''
) {
  assert
    .dom(testSelector('full-star'))
    .exists(
      { count: amountFull },
      'The right amount of full stars is rendered' + extraText
    );

  assert
    .dom(testSelector('empty-star'))
    .exists(
      { count: amountEmpty },
      'The right amount of empty stars is rendered' + extraText
    );
}

export async function songSortCheck(
  assert,
  currentURL,
  sortSelector,
  firstChildText,
  firstComment,
  lastChildText,
  lastComment
) {
  if (sortSelector != '') {
    await click(testSelector(sortSelector));
    // Format: sort-by-title-desc
    let sortArgs = sortSelector.split('-');
    let property = sortArgs[2];
    let modifier = sortArgs[3].toLowerCase() == 'desc' ? '-' : '';

    assert.ok(
      currentURL().includes('s=' + modifier + property),
      'The sort query param appears in the URL with the correct value'
    );
  }
  assert
    .dom(testSelector('song-list-item', ':first-child'))
    .hasText(firstChildText, 'The first song is ' + firstComment);
  assert
    .dom(testSelector('song-list-item', ':last-child'))
    .hasText(lastChildText, 'The last song is ' + lastComment);
}
