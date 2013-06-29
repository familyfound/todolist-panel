
module.exports = {
  name: 'display',
  title: 'Display',
  settings: [
    {
      name: 'insertBefore',
      title: 'Insert Before',
      value: 'LifeSketchVitalSection',
      options: [
        ['Vital Infirmation', 'LifeSketchVitalSection'],
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

