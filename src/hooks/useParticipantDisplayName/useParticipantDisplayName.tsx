const separator = ':::::';

export default function useParticipantDisplayName(participant) {
  const getDisplayName = participant => {
    if (participant) {
      let vals = participant.identity.split(separator);
      return vals[vals.length - 1];
    }
    return '';
  };

  const getUniqueName = (prefix, name) => {
    let r = Math.random()
      .toString(36)
      .substring(3);
    return `${prefix}${r}${separator}${name}`;
  };

  return { displayName: getDisplayName(participant), getUniqueName };
}
