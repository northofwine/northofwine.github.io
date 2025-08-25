Jekyll::Hooks.register :site, :post_write do |site|
    src = File.join(site.source, "_data", "contentful", "spaces", "northofwine.yaml")
    dest_dir = File.join(site.dest, "assets")
    FileUtils.mkdir_p(dest_dir)
    dest = File.join(dest_dir, "data.yaml")
    FileUtils.cp(src, dest) if File.exist?(src)
  end