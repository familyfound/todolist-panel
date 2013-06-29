
module.exports = {
  name: 'display',
  title: 'Display',
  settings: [
    {
      name: 'insertBefore',
      title: 'Insert Before',
      value: 'LifeSketchVitalSection',
      type: 'radio',
      options: [
        ['Vital Information', 'LifeSketchVitalSection'],
        ['Other Information', 'LifeSketchNonVitalSection'],
        ['Family Members', 'FamilyMembersSection'],
        ['Sources', 'SourcesSection'],
        ['Discussions', 'DiscussionsSection'],
        ['Temple Ordinances', 'TempleOrdinancesSection'],
        ['Last', 'last']
      ]
    }
  ]
};

